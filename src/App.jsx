import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import ProductCard from './components/ProductCard.jsx'
import Cart from './components/Cart.jsx'
import ItemModal from './components/ItemModal.jsx'
import LocationSelector from './components/LocationSelector.jsx'
import WelcomeModal from './components/WelcomeModal.jsx'
import CategoryNav from './components/CategoryNav.jsx'
import menuData from './data/menu.json'
import './index.css'

function App() {
  const [cart, setCart] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  
  // Extraer información estática del JSON
  const { restaurant, theme, locations } = menuData

  // Estados para los datos dinámicos (Google Sheets)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  // Calcular automáticamente si está abierto
  const checkIsOpen = () => true; // Forzado a abierto por petición del usuario

  const [isRestaurantOpen, setIsRestaurantOpen] = useState(checkIsOpen());
  const [exchangeRate, setExchangeRate] = useState(null);

  // Efecto inicial estático
  useEffect(() => {
    document.title = restaurant.name;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    let faviconUrl = restaurant.logoUrl || '/favicon.svg';
    if (faviconUrl && typeof faviconUrl === 'string' && faviconUrl.includes('unsplash.com')) {
      faviconUrl = faviconUrl.replace('auto=format', 'fm=jpg');
      link.type = 'image/jpeg';
    }
    link.href = faviconUrl;

    if (theme && theme.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor)
      document.documentElement.style.setProperty('--primary-hover', theme.primaryColor + 'cc')
    }

    // Fetch BCV rate
    fetch('https://ve.dolarapi.com/v1/dolares/oficial')
      .then(response => response.json())
      .then(data => {
        if (data && data.promedio) {
          setExchangeRate(data.promedio);
        }
      })
      .catch(error => console.error('Error fetching BCV rate:', error));

    const interval = setInterval(() => setIsRestaurantOpen(checkIsOpen()), 60000);
    return () => clearInterval(interval);
  }, [restaurant.name, restaurant.logoUrl, theme]);

  // Efecto dinámico al seleccionar una sede
  useEffect(() => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    setCategories([]); // Limpiar menú anterior
    setCart([]); // Limpiar carrito al cambiar de sede
    
    Papa.parse(selectedLocation.sheetUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const rows = results.data;
        const catMap = {};
        
        rows.forEach(row => {
          if (!row.Nombre || !row.Categoria) return;
          
          if (!catMap[row.Categoria]) {
            catMap[row.Categoria] = {
              id: 'c-' + row.Categoria.replace(/\s+/g, '-').toLowerCase(),
              name: row.Categoria,
              items: []
            };
          }
          
          const prevPriceKey = Object.keys(row).find(k => k.trim().toLowerCase() === 'precio anterior');
          const prevPriceVal = prevPriceKey ? parseFloat(row[prevPriceKey]) : null;
          const currentPrice = parseFloat(row.Precio) || 0;
          
          catMap[row.Categoria].items.push({
            id: row.ID,
            name: row.Nombre,
            description: row.Descripcion,
            price: currentPrice,
            previousPrice: (prevPriceVal && prevPriceVal > currentPrice) ? prevPriceVal : null,
            image: row.Imagen_URL,
            customizable: String(row.Personalizable).toUpperCase() !== 'FALSE',
            removableIngredients: row.Ingredientes_Removibles ? row.Ingredientes_Removibles.split(',').map(i => i.trim()).filter(Boolean) : [],
            agotado: String(row.Agotado).toUpperCase() === 'TRUE'
          });
        });
        
        const newCategories = Object.values(catMap);
        if (newCategories.length > 0) {
          setCategories(newCategories);
        }
        setIsLoading(false);
      },
      error: (error) => {
        console.error('Error loading Google Sheets data:', error);
        setIsLoading(false);
      }
    });
  }, [selectedLocation]);

  if (!selectedLocation) {
    return (
      <>
        <WelcomeModal restaurantName={restaurant.name} />
        <LocationSelector 
          locations={locations} 
          restaurant={restaurant} 
          onSelect={setSelectedLocation} 
        />
      </>
    );
  }

  const computedRestaurant = { 
    ...restaurant, 
    ...selectedLocation, // Sobrescribe con datos de la sede (teléfono, ubicación, etc)
    isOpen: isRestaurantOpen, 
    exchangeRate 
  };

  const allItems = categories.flatMap(c => c.items)

  const handleProductClick = (item) => {
    if (!isRestaurantOpen) {
      alert("Lo sentimos, estamos cerrados por el momento. ¡Te esperamos mañana de 10:00 AM a 11:00 PM!");
      return;
    }
    setSelectedItem(item)
  }

  const handleAddToCart = (details) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(cartItem => 
        cartItem.productId === details.productId &&
        cartItem.notes === details.notes &&
        JSON.stringify(cartItem.removedIngredients) === JSON.stringify(details.removedIngredients)
      )

      if (existingIndex >= 0) {
        const newCart = [...prev]
        newCart[existingIndex].quantity += details.quantity
        return newCart
      } else {
        return [...prev, {
          cartItemId: Date.now().toString(),
          ...details
        }]
      }
    })
    setSelectedItem(null)
  }

  const getProductTotalQty = (productId) => {
    return cart.reduce((total, cartItem) => {
      if (cartItem.productId === productId) return total + cartItem.quantity
      return total
    }, 0)
  }

  const handleUpdateCartItemQty = (cartItemId, change) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          return { ...item, quantity: item.quantity + change }
        }
        return item
      }).filter(item => item.quantity > 0)
    })
  }

  const handleRemoveCartItem = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', color: 'var(--text-secondary)' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h2 style={{ textAlign: 'center', padding: '0 20px', fontSize: '20px', lineHeight: '1.4' }}>Cargando menú de {selectedLocation.name}...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Hero />
      
      <div className="content-wrapper">
        <Header restaurant={computedRestaurant} />
        
        <CategoryNav categories={categories} />
        
        <main>
          {categories.map(category => (
            <section key={category.id} id={category.id} className="category-section">
              <h2 className="category-title">{category.name}</h2>
              <div className="product-list">
                {category.items.map(item => (
                  <ProductCard 
                    key={item.id} 
                    item={item} 
                    currency={computedRestaurant.currency}
                    cartQty={getProductTotalQty(item.id)}
                    exchangeRate={exchangeRate}
                    onClick={() => handleProductClick(item)}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
        
        <footer className="app-footer">
          <p>Desarrollado por <a href="https://wa.me/584244980621?text=Hola%2C%20vi%20tu%20trabajo%20y%20me%20gustar%C3%ADa%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20desarrollo%20de%20p%C3%A1ginas%20web%20para%20mi%20negocio." target="_blank" rel="noopener noreferrer" className="developer-link"><strong>Elías Espinal</strong></a></p>
          <p className="footer-sub">Soluciones de software profesional para restaurantes</p>
        </footer>
      </div>

      <Cart 
        cart={cart} 
        items={allItems} 
        currency={computedRestaurant.currency} 
        restaurant={computedRestaurant} 
        onUpdateQty={handleUpdateCartItemQty}
        onRemoveItem={handleRemoveCartItem}
      />

      {selectedItem && (
        <ItemModal 
          item={selectedItem} 
          currency={computedRestaurant.currency}
          exchangeRate={exchangeRate}
          onClose={() => setSelectedItem(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}

export default App
