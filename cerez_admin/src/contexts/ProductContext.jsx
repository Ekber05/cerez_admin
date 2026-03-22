// src/contexts/ProductContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Context yaradılır
const ProductContext = createContext();

// Custom hook - istifadəsi asan olsun deyə
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

// Provider komponenti
export const ProductProvider = ({ children }) => {
  // BÜTÜN MƏHSULLAR BURADA SAXLANILIR
  const [products, setProducts] = useState([
    {
      id: 'QM-001',
      name: 'Badam',
      category: 'Çərəzlər',
      price: 18.50,
      stock: 45,
      description: 'Təzə məhsul, xarab olmayıb',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-002',
      name: 'Fındıq',
      category: 'Çərəzlər',
      price: 15.90,
      stock: 62,
      description: 'Filə vətəni Azərbaycandır',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-003',
      name: 'Qoz',
      category: 'Çərəzlər',
      price: 12.80,
      stock: 38,
      description: 'Təzə məhsul',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-004',
      name: 'Püstə',
      category: 'Çərəzlər',
      price: 32.00,
      stock: 24,
      description: 'İran məhsulu, xüsusi seçim',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-005',
      name: 'Kəşmiş',
      category: 'Quru meyvələr',
      price: 8.90,
      stock: 73,
      description: 'Kişmiş, təbii qurutma',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-006',
      name: 'Qaysı qurusu',
      category: 'Quru meyvələr',
      price: 11.50,
      stock: 41,
      description: 'Şəkərsiz, təbii qaysı',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-007',
      name: 'Gavalı qurusu',
      category: 'Quru meyvələr',
      price: 9.90,
      stock: 35,
      description: 'Çəyirəkli gavalı',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-008',
      name: 'Ərik qurusu',
      category: 'Quru meyvələr',
      price: 14.20,
      stock: 28,
      description: 'Şəkərsiz, təbii ərik',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-009',
      name: 'İncir qurusu',
      category: 'Quru meyvələr',
      price: 16.80,
      stock: 32,
      description: 'Türkiyə məhsulu',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-010',
      name: 'Balqabaq toxumu',
      category: 'Çərəzlər',
      price: 7.50,
      stock: 56,
      description: 'Duzsuz, təbii qovrulmuş',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-011',
      name: 'Günəbaxan toxumu',
      category: 'Çərəzlər',
      price: 4.90,
      stock: 89,
      description: 'Duzlu, qovrulmuş',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-012',
      name: 'Hindistan cevizi',
      category: 'Quru meyvələr',
      price: 13.40,
      stock: 22,
      description: 'Rəndələnmiş hindistan cevizi',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-013',
      name: 'Ananas qurusu',
      category: 'Quru meyvələr',
      price: 21.90,
      stock: 17,
      description: 'Şəkərsiz, təbii ananas',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-014',
      name: 'Kivi qurusu',
      category: 'Quru meyvələr',
      price: 19.80,
      stock: 14,
      description: 'Təbii qurutma, şəkərsiz',
      image: null,
      unit: 'kq'
    },
    {
      id: 'QM-015',
      name: 'Şabalıd',
      category: 'Çərəzlər',
      price: 10.50,
      stock: 0,
      description: 'Təzə şabalıd, məhdud sayda',
      image: null,
      unit: 'kq'
    }
  ]);

  // Yeni məhsul əlavə etmək üçün funksiya
  const addProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  // Məhsul silmək üçün funksiya
  const deleteProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  // Məhsul redaktə etmək üçün funksiya
  const updateProduct = (updatedProduct) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  // Kateqoriyalar (select üçün)
  const categories = ['Quru meyvələr', 'Çərəzlər'];

  // Provider vasitəsilə bütün məlumat və funksiyaları ötür
  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      deleteProduct,
      updateProduct,
      categories
    }}>
      {children}
    </ProductContext.Provider>
  );
};