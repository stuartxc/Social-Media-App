'use client'

import { useState } from "react";

const Page = () => {

    const menuConfig =  [
        {
            title:'home',
        },
        {
            title:'services', 
            subitems:['cooking','cleaning'],
        },
        {
            title:'contact', 
            subitems:['phone','mail'],
        },
    ]



    const [expandedMenuIndex, setExpandedMenuIndex] = useState(null);

  // Function to handle menu expand and collapse
  const handleToggleSubmenu = (index) => {
    setExpandedMenuIndex(expandedMenuIndex === index ? null : index);
  };

  return (
    <div className="menu-wrapper">
      {menuConfig.map((item, index) => (
        <div key={index} data-test-id={`first-level-${item.title.toLowerCase()}`}>
          <div className="menu-item">
            {item.title}
            {item.subitems && (
              <button
                onClick={() => handleToggleSubmenu(index)}
                data-test-id={`button-${item.title.toLowerCase()}`}
              >
                {expandedMenuIndex === index ? 'Hide' : 'Expand'}
              </button>
            )}
          </div>
          {item.subitems && expandedMenuIndex === index && (
            <ul data-test-id={`ul-${item.title.toLowerCase()}`}>
              {item.subitems.map((subitem, subIndex) => (
                <li key={subIndex} data-test-id={`li-${item.title.toLowerCase()}-${subitem.toLowerCase()}`}>
                  {subitem}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default Page