import React from 'react';

export default function CategoryNav({ categories }) {
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Ofrecemos un pequeño margen superior para que no quede pegado al borde (considerando la barra fija)
      const offset = 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <div className="category-nav">
      {categories.map(category => (
        <button 
          key={category.id} 
          className="category-nav-btn"
          onClick={() => handleScroll(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
