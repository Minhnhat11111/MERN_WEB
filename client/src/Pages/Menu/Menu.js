import './Menu.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
  const [activeSection, setActiveSection] = useState('món chính');
  const [menuItems, setMenuItems] = useState({
    'món chính': [],
    'salad': [],
    'tráng miệng': [],
    'súp': [],
    'thức uống': []
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Gọi trực tiếp đến server port 4000
        const response = await axios.get('http://localhost:4000/api/food/list');
        
        const items = {
          'món chính': [],
          'salad': [],
          'tráng miệng': [],
          'súp': [],
          'thức uống': []
        };
        
        // Kiểm tra dữ liệu trả về
        console.log('Response data:', response.data);
        
        if (response.data.success && response.data.foods) {
          response.data.foods.forEach(item => {
            if (items[item.category.toLowerCase()]) {
              items[item.category.toLowerCase()].push(item);
            }
          });
        }
        
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  return (
    <div className="menu-container">
      <aside className="menu-sidebar">
        <ul>
          {['món chính', 'salad', 'tráng miệng', 'súp', 'thức uống'].map((section) => (
            <li key={section}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  showSection(section);
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {['món chính', 'salad', 'tráng miệng', 'súp', 'thức uống'].map((section) => (
        <section
          key={section}
          id={section}
          className="menu-section"
          style={{ display: activeSection === section ? 'block' : 'none' }}
        >
          <div className="title-menu">
            <h1>{section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ')}</h1>
          </div>
         
          <div className="menu-grid">
              {menuItems[section].map((item, index) => (
                  <div className="menu-item" key={index}>
                      <div className="img-container">
                          <img src={item.images} alt={item.name} />
                      </div>
                      <p>{item.name}</p>
                  </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Menu;