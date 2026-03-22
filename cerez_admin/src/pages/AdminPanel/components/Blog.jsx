// Blog.jsx - Fərdiləşdirilmiş Class Adları ilə
import React, { useState, useRef, useEffect } from 'react';
import './Blog.css';

// Kateqoriya Dropdown
const CategoryDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const categories = [
    { value: 'Sağlamlıq', label: 'Sağlamlıq', icon: 'fa-heart', description: 'Qida dəyəri, vitaminlər, immunitet' },
    { value: 'Məsləhətlər', label: 'Məsləhətlər', icon: 'fa-lightbulb', description: 'Saxlama, istifadə, praktik tövsiyələr' },
    { value: 'Reseptlər', label: 'Reseptlər', icon: 'fa-utensils', description: 'Evdə hazırlama, qarışıqlar, qurutma' },
    { value: 'Elm', label: 'Elm', icon: 'fa-flask', description: 'Araşdırmalar, elmi məlumatlar, tədqiqatlar' },
    { value: 'Mövsümi', label: 'Mövsümi', icon: 'fa-calendar-alt', description: 'Ramazan, bayramlar, mövsümi təkliflər' }
  ];

  const selectedCategory = categories.find(c => c.value === selected);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="blog-custom-dropdown" ref={dropdownRef}>
      <div 
        className={`blog-dropdown-header ${isOpen ? 'blog-dropdown-header--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          <div className="blog-selected-option">
            <i className={`fas ${selectedCategory?.icon}`}></i>
            <span>{selected}</span>
          </div>
        ) : (
          <span className="blog-dropdown-placeholder">Kateqoriya seçin</span>
        )}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      
      {isOpen && (
        <div className="blog-dropdown-menu">
          {categories.map(category => (
            <div
              key={category.value}
              className={`blog-dropdown-item ${selected === category.value ? 'blog-dropdown-item--selected' : ''}`}
              onClick={() => {
                onSelect(category.value);
                setIsOpen(false);
              }}
            >
              <div className="blog-option-icon">
                <i className={`fas ${category.icon}`}></i>
              </div>
              <div className="blog-option-content">
                <span className="blog-option-title">{category.label}</span>
                <span className="blog-option-description">{category.description}</span>
              </div>
              {selected === category.value && (
                <i className="fas fa-check blog-option-check"></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Məqalə Tipi Dropdown
const TypeDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const types = [
    { value: 'Sağlam Qidalanma', label: 'Sağlam Qidalanma', icon: 'fa-heartbeat', description: 'Qida dəyəri, vitaminlər, sağlamlıq tövsiyələri' },
    { value: 'Praktik Məsləhətlər', label: 'Praktik Məsləhətlər', icon: 'fa-lightbulb', description: 'Saxlama üsulları, istifadə tövsiyələri, praktik bilgilər' },
    { value: 'Ev Reseptləri', label: 'Ev Reseptləri', icon: 'fa-utensils', description: 'Qurutma üsulları, qarışıqlar, evdə hazırlama' },
    { value: 'Elmi Məqalə', label: 'Elmi Məqalə', icon: 'fa-flask', description: 'Araşdırmalar, elmi məlumatlar, tədqiqat nəticələri' },
    { value: 'Mövsümi Təkliflər', label: 'Mövsümi Təkliflər', icon: 'fa-calendar-alt', description: 'Ramazan, bayramlar, mövsümi məhsullar' }
  ];

  const selectedType = types.find(t => t.value === selected);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="blog-custom-dropdown" ref={dropdownRef}>
      <div 
        className={`blog-dropdown-header ${isOpen ? 'blog-dropdown-header--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          <div className="blog-selected-option">
            <i className={`fas ${selectedType?.icon}`}></i>
            <span>{selected}</span>
          </div>
        ) : (
          <span className="blog-dropdown-placeholder">Məqalə tipi seçin</span>
        )}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      
      {isOpen && (
        <div className="blog-dropdown-menu">
          {types.map(type => (
            <div
              key={type.value}
              className={`blog-dropdown-item ${selected === type.value ? 'blog-dropdown-item--selected' : ''}`}
              onClick={() => {
                onSelect(type.value);
                setIsOpen(false);
              }}
            >
              <div className="blog-option-icon">
                <i className={`fas ${type.icon}`}></i>
              </div>
              <div className="blog-option-content">
                <span className="blog-option-title">{type.label}</span>
                <span className="blog-option-description">{type.description}</span>
              </div>
              {selected === type.value && (
                <i className="fas fa-check blog-option-check"></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Status Dropdown
const StatusDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const statuses = [
    { value: 'published', label: 'Yayımlanıb', icon: 'fa-globe', color: '#48bb78', description: 'Məqalə saytda görünür və oxucular üçün əlçatandır' },
    { value: 'draft', label: 'Qaralama', icon: 'fa-pencil-alt', color: '#ed8936', description: 'Məqalə üzərində iş davam edir, saytda görünmür' }
  ];

  const selectedStatus = statuses.find(s => s.value === selected);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="blog-custom-dropdown" ref={dropdownRef}>
      <div 
        className={`blog-dropdown-header ${isOpen ? 'blog-dropdown-header--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected ? (
          <div className="blog-selected-option">
            <i className={`fas ${selectedStatus?.icon}`} style={{color: selectedStatus?.color}}></i>
            <span>{selectedStatus?.label}</span>
          </div>
        ) : (
          <span className="blog-dropdown-placeholder">Status seçin</span>
        )}
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </div>
      
      {isOpen && (
        <div className="blog-dropdown-menu">
          {statuses.map(status => (
            <div
              key={status.value}
              className={`blog-dropdown-item ${selected === status.value ? 'blog-dropdown-item--selected' : ''}`}
              onClick={() => {
                onSelect(status.value);
                setIsOpen(false);
              }}
            >
              <div className="blog-option-icon" style={{background: status.color}}>
                <i className={`fas ${status.icon}`}></i>
              </div>
              <div className="blog-option-content">
                <span className="blog-option-title">{status.label}</span>
                <span className="blog-option-description">{status.description}</span>
              </div>
              {selected === status.value && (
                <i className="fas fa-check blog-option-check" style={{color: status.color}}></i>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Blog = () => {
  const [viewMode, setViewMode] = useState('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewArticle, setViewArticle] = useState(null);

  const [articles, setArticles] = useState([
    {
      id: 1,
      title: 'Quru meyvələrin faydaları: Qış aylarında enerji mənbəyiniz',
      description: 'Qaysı, gavalı, əncir və digər quru meyvələrin sağlamlığa faydaları haqqında ətraflı məlumat. Vitaminlərlə zəngin olan bu qidalar immunitet sisteminizi gücləndirir.',
      content: `Quru meyvələr təbii vitamin və mineral mənbəyidir. Qış aylarında təzə meyvə çeşidi azaldığı üçün quru meyvələr əvəzedilməz qida mənbəyinə çevrilir.

Qaysı qurusu - A vitamini və dəmir baxımından zəngindir. Göz sağlamlığı üçün faydalıdır və qan azlığına qarşı kömək edir.

Gavalı qurusu - Lif baxımından zəngin olmaqla həzm sistemini tənzimləyir. Antioksidantlarla zəngindir.

Əncir qurusu - Kalsium və kalium mənbəyidir. Sümük sağlamlığı üçün əhəmiyyətlidir.

Xurma - Təbii enerji mənbəyidir. Tərkibindəki şəkərlər orqanizm tərəfindən asanlıqla mənimsənilir.

Bu quru meyvələri günlük qidalanma proqramınıza əlavə etməklə immunitet sisteminizi gücləndirə, enerji səviyyənizi yüksəldə bilərsiniz.`,
      date: '2025-02-20',
      readTime: 6,
      category: 'Sağlamlıq',
      tags: ['quru meyvə', 'sağlamlıq', 'qaysı', 'əncir', 'immunitet'],
      status: 'published',
      type: 'Sağlam Qidalanma',
      image: null,
      imagePreview: null
    },
    {
      id: 2,
      title: 'Çərəzlərin doğru saxlanma üsulları: Təzəlik necə qorunur?',
      description: 'Badam, qoz, fındıq və digər çərəzlərin uzun müddət təzə qalması üçün ən effektiv saxlama üsulları. Çərəzləri düzgün saxlamaqla dadını və qida dəyərini qoruyun.',
      content: `Çərəzlərin təzə qalması üçün düzgün saxlama üsulları çox önəmlidir. Yanlış saxlanan çərəzlər tez xarab olur, dadını itirir və qida dəyərini azaldır.

Qozun saxlanması:
Qozu soyuducuda və ya dondurucuda saxlamaq ən yaxşı üsuldur. Hava keçirməyən qablarda saxlanmalıdır. Qoz otaq temperaturunda tez xarab olur.

Badamın saxlanması:
Badamı sərin, qaranlıq və quru yerdə, hava keçirməyən qablarda saxlamaq lazımdır. Soyuducuda 1 ilə qədər saxlanıla bilər.

Fındığın saxlanması:
Fındığı da sərin yerdə, qabıqlı şəkildə saxlamaq daha yaxşıdır. Qabıqsız fındıq tez xarab olur.

Ümumi qaydalar:
- Çərəzləri birbaşa günəş işığından uzaq saxlayın
- Nəmli yerlərdə saxlamayın
- Hava keçirməyən qablardan istifadə edin
- Uzun müddət saxlamaq üçün soyuducu və ya dondurucudan istifadə edin
- Əzilmiş və qırılmış çərəzlər daha tez xarab olur`,
      date: '2025-02-18',
      readTime: 5,
      category: 'Məsləhətlər',
      tags: ['çərəz', 'saxlama', 'qoz', 'badam', 'fındıq'],
      status: 'published',
      type: 'Praktik Məsləhətlər',
      image: null,
      imagePreview: null
    },
    {
      id: 3,
      title: 'Evdə quru meyvə necə hazırlanır? Addım-addım təlimat',
      description: 'Bağınızdan topladığınız meyvələri ev şəraitində qurudaraq il boyu istifadə edin. Alma, armud, gavalı və əzgil qurusu hazırlamağın asan üsulları.',
      content: `Ev şəraitində quru meyvə hazırlamaq həm qənaətcil, həm də sağlamdır. Mağazadan alınan quru meyvələrə əlavə şəkər və konservantlar qatıla bilər.

Alma qurusu:
Almaları yuyun, qabığını soyun (istəyə bağlı), nüvəsini çıxarın və nazik dilimlərə kəsin. Dilimləri limonlu suda 10 dəqiqə saxlayın (qaralmaması üçün). Sonra təmiz bir parça üzərində qurudun.

Günəşdə qurutma:
Meyvə dilimlərini təmiz bir parça və ya xüsusi qurutma torları üzərinə düzün. Üstünü nazik tüllə örtün. Günəşli havada 3-5 gün ərzində quruyacaq. Gecələr içəri yığın.

Fırında qurutma:
Meyvə dilimlərini perqament kağızı döşənmiş tepsiyə düzün. Fırını ən aşağı temperaturda (50-60°C) qızdırın. Qapısını bir az açıq saxlayın. 4-6 saat ərzində quruyacaq.

Qurutma maşınında:
Xüsusi qurutma maşınları ən ideal üsuldur. Təlimata uyğun temperaturda 8-12 saat qurudun.

Saxlama:
Hazır quru meyvələri tam soyuduqdan sonra hava keçirməyən qablarda, sərin və qaranlıq yerdə saxlayın.`,
      date: '2025-02-22',
      readTime: 8,
      category: 'Reseptlər',
      tags: ['evdə hazırlama', 'qurutma', 'alma', 'armud', 'əzgil'],
      status: 'draft',
      type: 'Ev Reseptləri',
      image: null,
      imagePreview: null
    },
    {
      id: 4,
      title: 'Qoz və badamın beyin fəaliyyətinə təsiri: Elmi araşdırmalar',
      description: 'Elmi araşdırmalara görə, qoz və badamın müntəzəm istehlakı yaddaşı gücləndirir və beyin fəaliyyətini yaxşılaşdırır. Bu çərəzlərin tərkibindəki omeqa-3 yağ turşularının faydaları.',
      content: `Son illərdə aparılan elmi araşdırmalar qoz və badamın beyin sağlamlığına müsbət təsirini təsdiqləyir.

Qozun tərkibi:
Qoz omeqa-3 yağ turşuları, antioksidantlar və E vitamini baxımından zəngindir. Tərkibindəki alfa-linoleik turşu (ALA) beyin hüceyrələrinin qorunmasında mühüm rol oynayır.

Badamın tərkibi:
Badam riboflavin və L-karnitinlə zəngindir. Bu maddələr sinir hüceyrələrinin sağlamlığı üçün vacibdir.

Araşdırma nəticələri:
Harvard Universitetinin araşdırmasına görə, həftədə 5 dəfə qoz yeyən yaşlı insanlarda yaddaş itkisi riski 30% azalır.

Kaliforniya Universitetinin tədqiqatı qozun tərkibindəki antioksidantların beyin yaşlanmasını yavaşlatdığını göstərir.

Badamın tərkibindəki maqnezium sinir impulslarının ötürülməsində vacib rol oynayır.

Tövsiyə:
Gündə 5-6 ədəd qoz və 10-12 ədəd badam yemək beyin sağlamlığı üçün kifayətdir.`,
      date: '2025-02-15',
      readTime: 7,
      category: 'Elm',
      tags: ['qoz', 'badam', 'beyin', 'yaddaş', 'omeqa-3'],
      status: 'published',
      type: 'Elmi Məqalə',
      image: null,
      imagePreview: null
    },
    {
      id: 5,
      title: 'Ramazan ayı üçün enerji verən quru meyvə qarışıqları',
      description: 'Ramazan ayında oruc tutarkən enerjinizi qorumaq üçün ideal quru meyvə və çərəz qarışıqları. Xurma, qaysı qurusu, qoz və badamdan hazırlanan qəlyanaltılar.',
      content: `Ramazan ayında uzun saatlar ac qaldıqdan sonra iftar və sahurda enerji verən qidalar qəbul etmək çox önəmlidir. Quru meyvə və çərəz qarışıqları ideal seçimdir.

Enerji qarışığı 1:
- 5 ədəd xurma
- 10 ədəd badam
- 5 ədəd qoz
- 1 xörək qaşığı quru üzüm

Bu qarışıq iftarı açarkən ani enerji verir.

Sahur qarışığı:
- 3 ədəd qaysı qurusu
- 1 xörək qaşığı bal
- 2 xörək qaşığı yulaf ezmesi
- 10 ədəd fındıq

Bu qarışıq gün boyu tox qalmağa kömək edir.

Enerji topları:
- 10 ədəd xurma (çəyirdəksiz)
- 1 stəkan qoz
- 1 stəkan badam
- 2 xörək qaşığı kakao
- Hindistan cevizi

Bütün maddələri robotda çəkin, kiçik toplar hazırlayın və hindistan cevizində bulayın.

Faydalar:
- Xurma təbii şəkər mənbəyidir
- Qoz və badam sağlam yağlar və protein ehtiva edir
- Quru meyvələr vitamin və mineral ehtiyacını qarşılayır
- Lifli qidalar toxluq hissini uzadır`,
      date: '2025-02-10',
      readTime: 4,
      category: 'Mövsümi',
      tags: ['ramazan', 'xurma', 'enerji', 'oruc', 'qəlyanaltı'],
      status: 'published',
      type: 'Mövsümi Təkliflər',
      image: null,
      imagePreview: null
    },
    {
      id: 6,
      title: 'Əncir qurusunun bilinməyən faydaları: Sümük sağlamlığından həzmə',
      description: 'Əncir qurusunun kalsium, lif və antioksidantlarla zəngin tərkibi haqqında. Sümük sağlamlığı, həzm sistemi və dəri üçün faydaları.',
      content: `Əncir qurusu qədim zamanlardan bəri müalicəvi xüsusiyyətləri ilə tanınır. Müasir elm də bu faydaları təsdiqləyir.

Kalsium mənbəyi:
100 qram əncir qurusu təxminən 160 mq kalsium ehtiva edir. Bu, süd məhsullarına alternativ olaraq sümük sağlamlığı üçün əhəmiyyətlidir.

Lif zənginliyi:
Əncir qurusu həll olunan və həll olunmayan liflərlə zəngindir. Bu, həzm sistemini tənzimləyir, qəbizliyi aradan qaldırır və bağırsaq sağlamlığını qoruyur.

Antioksidantlar:
Tərkibindəki fenolik birləşmələr və flavonoidlər güclü antioksidant təsir göstərir. Bu maddələr hüceyrələri sərbəst radikallardan qoruyur.

Dəri sağlamlığı:
Əncir qurusundakı vitaminlər və minerallar dəri sağlamlığı üçün faydalıdır. Kollagen istehsalını dəstəkləyir və dərini qidalandırır.

Qan təzyiqi:
Tərkibindəki kalium qan təzyiqini tənzimləməyə kömək edir.

İstifadə tövsiyələri:
- Gündə 2-3 ədəd əncir qurusu yemək kifayətdir
- Səhər yeməyində yulaf və ya yoqurtla qarışdırın
- Qəlyanaltı olaraq çayın yanında yeyin
- Salatalara əlavə edin`,
      date: '2025-02-05',
      readTime: 5,
      category: 'Sağlamlıq',
      tags: ['əncir', 'kalsium', 'həzm', 'antioksidant', 'sümük'],
      status: 'draft',
      type: 'Sağlam Qidalanma',
      image: null,
      imagePreview: null
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Yeni məqalə üçün form state
  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
    status: 'draft',
    type: '',
    tags: [],
    image: null,
    imagePreview: '',
    readTime: ''
  });

  // Tag əlavə etmə üçün state
  const [tagInput, setTagInput] = useState('');

  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewArticle({
          ...newArticle,
          image: file,
          imagePreview: reader.result
        });
        
        // Əgər redaktə edilən məqalə varsa, onu da yenilə
        if (selectedArticle) {
          setSelectedArticle({
            ...selectedArticle,
            image: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewArticle({
      ...newArticle,
      image: null,
      imagePreview: ''
    });
  };

  // Tag əlavə et
  const handleAddTag = () => {
    if (tagInput.trim() && !newArticle.tags.includes(tagInput.trim())) {
      setNewArticle({
        ...newArticle,
        tags: [...newArticle.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  // Tag sil
  const handleRemoveTag = (tagToRemove) => {
    setNewArticle({
      ...newArticle,
      tags: newArticle.tags.filter(t => t !== tagToRemove)
    });
  };

  // Enter düyməsi ilə tag əlavə et
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleCreateArticle = () => {
    if (selectedArticle) {
      // Redaktə
      setArticles(articles.map(a => 
        a.id === selectedArticle.id ? { 
          ...selectedArticle, 
          ...newArticle, 
          id: selectedArticle.id,
          image: newArticle.imagePreview || selectedArticle.image
        } : a
      ));
    } else {
      // Yeni məqalə
      const article = {
        id: articles.length + 1,
        ...newArticle,
        date: new Date().toISOString().split('T')[0],
        readTime: parseInt(newArticle.readTime) || 5,
        image: newArticle.imagePreview
      };
      setArticles([...articles, article]);
    }
    closeCreateModal();
  };

  const handleDeleteArticle = () => {
    if (articleToDelete) {
      setArticles(articles.filter(a => a.id !== articleToDelete));
      setShowDeleteConfirmModal(false);
      setArticleToDelete(null);
    }
  };

  const handleEditArticle = (article) => {
    setSelectedArticle(article);
    setNewArticle({
      title: article.title,
      description: article.description,
      category: article.category,
      content: article.content || '',
      status: article.status,
      type: article.type,
      tags: article.tags || [],
      image: null,
      imagePreview: article.image || '',
      readTime: article.readTime
    });
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedArticle(null);
    setNewArticle({
      title: '',
      description: '',
      category: '',
      content: '',
      status: 'draft',
      type: '',
      tags: [],
      image: null,
      imagePreview: '',
      readTime: ''
    });
    setTagInput('');
  };

  const openDeleteConfirmModal = (id) => {
    setArticleToDelete(id);
    setShowDeleteConfirmModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirmModal(false);
    setArticleToDelete(null);
  };

  const openViewModal = (article) => {
    setViewArticle(article);
    setShowViewModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewArticle(null);
    document.body.style.overflow = 'auto';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'published': return <span className="blog-status-badge blog-status-badge--published">Yayımlanıb</span>;
      case 'draft': return <span className="blog-status-badge blog-status-badge--draft">Qaralama</span>;
      default: return null;
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || article.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <h1>Blog</h1>
      </div>

      <div className="blog-filters-section">
        <div className="blog-search-box">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Məqalə axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          {searchTerm && (
            <button 
              type="button"
              className="blog-search-clear"
              onClick={clearSearch}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        
        <div className="blog-view-toggle">
          <button 
            type="button"
            className={`blog-view-btn ${viewMode === 'card' ? 'blog-view-btn--active' : ''}`}
            onClick={() => setViewMode('card')}
          >
            Kart Görünüşü
          </button>
          <span className="blog-view-separator">|</span>
          <button 
            type="button"
            className={`blog-view-btn ${viewMode === 'list' ? 'blog-view-btn--active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            Siyahı Görünüşü
          </button>
        </div>

        <button 
          type="button"
          className="blog-create-button"
          onClick={() => {
            setSelectedArticle(null);
            setNewArticle({
              title: '',
              description: '',
              category: '',
              content: '',
              status: 'draft',
              type: '',
              tags: [],
              image: null,
              imagePreview: '',
              readTime: ''
            });
            setShowCreateModal(true);
          }}
        >
          <i className="fas fa-plus"></i>
          Yeni Məqalə
        </button>
      </div>

      <div className="blog-status-filters">
        <button 
          type="button"
          className={`blog-status-btn ${filterStatus === 'all' ? 'blog-status-btn--active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Hamısı ({articles.length})
        </button>
        <button 
          type="button"
          className={`blog-status-btn ${filterStatus === 'published' ? 'blog-status-btn--active' : ''}`}
          onClick={() => setFilterStatus('published')}
        >
          Yayımlanıb ({articles.filter(a => a.status === 'published').length})
        </button>
        <button 
          type="button"
          className={`blog-status-btn ${filterStatus === 'draft' ? 'blog-status-btn--active' : ''}`}
          onClick={() => setFilterStatus('draft')}
        >
          Qaralama ({articles.filter(a => a.status === 'draft').length})
        </button>
      </div>

      {searchTerm && (
        <div className="blog-search-results-info">
          <p>
            <i className="fas fa-search"></i> 
            "{searchTerm}" üçün {filteredArticles.length} nəticə tapıldı
          </p>
        </div>
      )}

      {filteredArticles.length === 0 ? (
        <div className="blog-no-results">
          <i className="fas fa-search"></i>
          <h3>Heç bir məqalə tapılmadı</h3>
          <p>Axtarış şərtlərinizi dəyişdirin və ya yeni məqalə yaradın</p>
          <button 
            type="button"
            className="blog-create-button-small"
            onClick={() => {
              setSelectedArticle(null);
              setNewArticle({
                title: '',
                description: '',
                category: '',
                content: '',
                status: 'draft',
                type: '',
                tags: [],
                image: null,
                imagePreview: '',
                readTime: ''
              });
              setShowCreateModal(true);
            }}
          >
            <i className="fas fa-plus"></i>
            Yeni Məqalə
          </button>
        </div>
      ) : (
        <div className={`blog-articles-grid blog-articles-grid--${viewMode}`}>
          {filteredArticles.map(article => (
            <div key={article.id} className={`blog-article-card blog-article-card--${article.status} blog-article-card--${viewMode}`}>
              {(article.imagePreview || article.image) && (
                <div 
                  className="blog-article-image" 
                  style={{backgroundImage: `url(${article.imagePreview || article.image})`}}
                >
                  {article.type && viewMode === 'card' && (
                    <div className="blog-article-type-badge">{article.type}</div>
                  )}
                </div>
              )}
              
              {viewMode === 'card' && !article.imagePreview && !article.image && article.type && (
                <div className="blog-article-type-header">{article.type}</div>
              )}

              <div className="blog-article-content">
                <div className="blog-article-header">
                  <h3 className="blog-article-title">{article.title}</h3>
                  {getStatusBadge(article.status)}
                </div>

                {viewMode === 'list' && article.type && (
                  <div className="blog-article-type-list">{article.type}</div>
                )}

                <p className="blog-article-description">{article.description}</p>
                
                <div className="blog-article-meta">
                  <span className="blog-meta-item">
                    <i className="far fa-calendar"></i>
                    {new Date(article.date).toLocaleDateString('az-AZ')}
                  </span>
                  <span className="blog-meta-item">
                    <i className="far fa-clock"></i>
                    {article.readTime} dəq
                  </span>
                  {article.category && (
                    <span className="blog-meta-item">
                      <i className="fas fa-tag"></i>
                      {article.category}
                    </span>
                  )}
                </div>

                {article.tags && article.tags.length > 0 && (
                  <div className="blog-article-tags">
                    {article.tags.map((tag, index) => (
                      <a key={index} href="#" className="blog-tag-link" onClick={(e) => e.preventDefault()}>
                        <i className="fas fa-hashtag"></i>
                        {tag}
                      </a>
                    ))}
                  </div>
                )}

                <div className="blog-article-actions">
                  <button 
                    type="button"
                    className="blog-action-btn blog-action-btn--view"
                    onClick={() => openViewModal(article)}
                  >
                    <i className="fas fa-eye"></i>
                    Bax
                  </button>
                  <button 
                    type="button"
                    className="blog-action-btn blog-action-btn--edit"
                    onClick={() => handleEditArticle(article)}
                  >
                    <i className="fas fa-edit"></i>
                    Redaktə
                  </button>
                  <button 
                    type="button"
                    className="blog-action-btn blog-action-btn--delete"
                    onClick={() => openDeleteConfirmModal(article.id)}
                  >
                    <i className="fas fa-trash"></i>
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Məqaləyə baxma modali */}
      {showViewModal && viewArticle && (
        <div className="blog-modal-overlay" onClick={closeViewModal}>
          <div className="blog-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="blog-view-modal-header">
              <h2>{viewArticle.title}</h2>
              <button 
                type="button"
                className="blog-modal-close" 
                onClick={closeViewModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="blog-view-modal-body">
              {(viewArticle.imagePreview || viewArticle.image) && (
                <div className="blog-view-modal-image">
                  <img src={viewArticle.imagePreview || viewArticle.image} alt={viewArticle.title} />
                </div>
              )}
              
              <div className="blog-view-modal-meta">
                <span className="blog-meta-item">
                  <i className="far fa-calendar"></i> {new Date(viewArticle.date).toLocaleDateString('az-AZ')}
                </span>
                <span className="blog-meta-item">
                  <i className="far fa-clock"></i> {viewArticle.readTime} dəq oxuma
                </span>
                <span className="blog-meta-item">
                  <i className="fas fa-tag"></i> {viewArticle.category}
                </span>
              </div>
              
              <div className="blog-view-modal-type-badge">{viewArticle.type}</div>
              
              <div className="blog-view-modal-description">
                <p>{viewArticle.description}</p>
              </div>
              
              <div className="blog-view-modal-content">
                <h3>Məqalə məzmunu</h3>
                <div className="blog-content-text">
                  {viewArticle.content ? (
                    viewArticle.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p>Bu məqalənin məzmunu hələ əlavə edilməyib.</p>
                  )}
                </div>
              </div>
              
              {viewArticle.tags && viewArticle.tags.length > 0 && (
                <div className="blog-view-modal-tags">
                  <h4>Teqlər:</h4>
                  <div className="blog-tags-container">
                    {viewArticle.tags.map((tag, index) => (
                      <span key={index} className="blog-view-tag">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="blog-view-modal-footer">
              <button 
                type="button"
                className="blog-cancel-btn" 
                onClick={closeViewModal}
              >
                Bağla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yeni məqalə yaratma/redaktə modali */}
      {showCreateModal && (
        <div className="blog-modal-overlay" onClick={closeCreateModal}>
          <div className="blog-modal" onClick={(e) => e.stopPropagation()}>
            <div className="blog-modal-header">
              <h2>{selectedArticle ? 'Məqaləni redaktə et' : 'Yeni məqalə yarat'}</h2>
              <button 
                type="button"
                className="blog-modal-close" 
                onClick={closeCreateModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="blog-modal-body">
              {/* Şəkil yükləmə bölməsi */}
              <div className="blog-image-upload-section">
                <label className="blog-image-upload-label">Məqalə şəkli</label>
                <div className="blog-image-upload-area">
                  {newArticle.imagePreview ? (
                    <div className="blog-image-preview">
                      <img src={newArticle.imagePreview} alt="Preview" />
                      <button 
                        type="button"
                        className="blog-remove-image-btn"
                        onClick={handleRemoveImage}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="blog-upload-placeholder">
                      <input 
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="blog-file-input"
                      />
                      <label htmlFor="image-upload" className="blog-upload-label">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Şəkil yükləmək üçün klikləyin</span>
                        <span className="blog-upload-hint">PNG, JPG və ya GIF (max. 5MB)</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="blog-form-grid">
                <div className="blog-form-group blog-form-group--full">
                  <label>Məqalə başlığı *</label>
                  <input 
                    type="text" 
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    placeholder="Məs: Quru meyvələrin faydaları, Çərəzlərin saxlanma üsulları..."
                    className="blog-form-input"
                  />
                </div>

                <div className="blog-form-group blog-form-group--full">
                  <label>Qısa təsvir</label>
                  <textarea 
                    value={newArticle.description}
                    onChange={(e) => setNewArticle({...newArticle, description: e.target.value})}
                    placeholder="Məqalə haqqında qısa məlumat. Məs: Qaysı, gavalı, əncir və digər quru meyvələrin sağlamlığa faydaları..."
                    rows="3"
                    className="blog-form-textarea"
                  />
                </div>

                <div className="blog-form-group">
                  <label>Kateqoriya</label>
                  <CategoryDropdown 
                    selected={newArticle.category}
                    onSelect={(value) => setNewArticle({...newArticle, category: value})}
                  />
                </div>

                <div className="blog-form-group">
                  <label>Oxunma müddəti (dəq)</label>
                  <input 
                    type="number" 
                    value={newArticle.readTime}
                    onChange={(e) => setNewArticle({...newArticle, readTime: e.target.value})}
                    placeholder="5"
                    min="1"
                    className="blog-form-input"
                  />
                </div>

                <div className="blog-form-group">
                  <label>Məqalə tipi</label>
                  <TypeDropdown 
                    selected={newArticle.type}
                    onSelect={(value) => setNewArticle({...newArticle, type: value})}
                  />
                </div>

                <div className="blog-form-group">
                  <label>Status</label>
                  <StatusDropdown 
                    selected={newArticle.status}
                    onSelect={(value) => setNewArticle({...newArticle, status: value})}
                  />
                </div>

                {/* Tag əlavə etmə bölməsi */}
                <div className="blog-form-group blog-form-group--full blog-selection-section">
                  <label>Teqlər (məhsul adları, faydalar, mövzular)</label>
                  
                  <div className="blog-tag-input-group">
                    <input 
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Məs: quru meyvə, qoz, badam, sağlamlıq, resept..."
                      className="blog-tag-input"
                    />
                    <button 
                      type="button"
                      onClick={handleAddTag}
                      className="blog-add-tag-btn"
                      disabled={!tagInput.trim()}
                    >
                      <i className="fas fa-plus"></i>
                      Əlavə et
                    </button>
                  </div>

                  {newArticle.tags.length > 0 && (
                    <div className="blog-selected-tags">
                      <div className="blog-selected-tags-title">
                        <i className="fas fa-tags"></i>
                        <span>Əlavə edilmiş teqlər ({newArticle.tags.length})</span>
                      </div>
                      <div className="blog-tags-list">
                        {newArticle.tags.map((tag, index) => (
                          <div key={index} className="blog-tag-item">
                            <span className="blog-tag-name">#{tag}</span>
                            <button 
                              type="button"
                              className="blog-remove-tag-btn"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="blog-form-group blog-form-group--full">
                  <label>Məqalə məzmunu</label>
                  <textarea 
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    placeholder="Məqalə məzmununu daxil edin. Quru meyvələr, çərəzlər, sağlam qidalanma haqqında ətraflı məlumat..."
                    rows="8"
                    className="blog-form-textarea"
                  />
                </div>
              </div>
            </div>

            <div className="blog-modal-footer">
              <button 
                type="button"
                className="blog-cancel-btn" 
                onClick={closeCreateModal}
              >
                Ləğv et
              </button>
              <button 
                type="button"
                className="blog-save-btn"
                onClick={handleCreateArticle}
                disabled={!newArticle.title}
              >
                <i className="fas fa-save"></i>
                {selectedArticle ? 'Yadda saxla' : 'Məqalə yarat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sil təsdiq modali */}
      {showDeleteConfirmModal && (
        <div className="blog-modal-overlay" onClick={closeDeleteModal}>
          <div className="blog-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="blog-confirm-modal-icon blog-confirm-modal-icon--delete">
              <i className="fas fa-trash-alt"></i>
            </div>
            <h3>Məqaləni sil</h3>
            <p>Bu məqaləni silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz.</p>
            <div className="blog-confirm-modal-actions">
              <button 
                type="button"
                className="blog-cancel-btn"
                onClick={closeDeleteModal}
              >
                İmtina
              </button>
              <button 
                type="button"
                className="blog-delete-btn"
                onClick={handleDeleteArticle}
              >
                Bəli, sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;