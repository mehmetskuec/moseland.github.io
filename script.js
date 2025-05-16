// MOSELAND - Koordinat Sorgulama Sistemi JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementlerini Seç
    const worldSelect = document.getElementById('world');
    const xCoordInput = document.getElementById('x-coord');
    const yCoordInput = document.getElementById('y-coord');
    const queryButton = document.getElementById('query-button');
    const queryResult = document.getElementById('query-result');
    
    // Event Listener
    queryButton.addEventListener('click', handleQuery);
    
    /**
     * Sistem Başlatma Animasyonu
     */
    function initializeSystem() {
        const initMessages = [
            "MOSELAND SİSTEM BAŞLATILIYOR...",
            "VERİ TABANLARI YÜKLENİYOR...",
            "BAĞLANTI KURULUYOR...",
            "KUANTUM MODÜLÜ HAZIR.",
            "KOORDİNAT HESAPLAMA SİSTEMİ AKTİF.",
            "SİSTEM HAZIR."
        ];
        
        let currentMessageIndex = 0;
        let currentCharIndex = 0;
        let typingElement = initMessage.querySelector('.typing');
        
        // İlk mesajı yazmaya başla
        const typingInterval = setInterval(() => {
            if (currentMessageIndex >= initMessages.length) {
                clearInterval(typingInterval);
                setTimeout(() => {
                    initialized = true;
                    initMessage.innerHTML = `<p>> SİSTEM HAZIR. SORGU BEKLENİYOR.</p>`;
                }, 1000);
                return;
            }
            
            const currentMessage = initMessages[currentMessageIndex];
            
            if (currentCharIndex < currentMessage.length) {
                // Karakter ekle (imleç olmadan)
                typingElement.innerHTML = `> ${currentMessage.substring(0, currentCharIndex + 1)}<span class="typing-cursor">■</span>`;
                currentCharIndex++;
            } else {
                // Mesaj tamamlandı, bir sonraki mesaja geç
                typingElement.innerHTML = `> ${currentMessage}`;
                initMessage.innerHTML += `<div class="typing"><span class="typing-cursor">■</span></div>`;
                typingElement = initMessage.querySelector('.typing:last-child');
                
                currentMessageIndex++;
                currentCharIndex = 0;
                
                // Yeni satıra geçmeden önce kısa bir duraklama
                clearInterval(typingInterval);
                setTimeout(() => {
                    // Tüm mesajlar tamamlanmadıysa, devam et
                    if (currentMessageIndex < initMessages.length) {
                        typingInterval = setInterval(arguments.callee, 50);
                    }
                }, 500);
            }
        }, 50);
    }
    
    /**
     * Dünya Değiştirildiğinde Veri Yükleme Simülasyonu
     */
    function simulateDataLoad(world) {
        if (!initialized) return;
        
        const formattedWorld = world.toUpperCase();
        initMessage.style.display = 'block';
        queryResult.innerHTML = '';
        
        initMessage.innerHTML = `<p>> ${formattedWorld} VERİ TABANI SEÇİLDİ.</p>`;
        setTimeout(() => {
            initMessage.innerHTML += `<p>> VERİ TABANI BAĞLANTISI KURULDU. KOORDİNAT GİRİŞİ BEKLENİYOR.</p>`;
        }, 600);
    }
    
    /**
     * Sorgu İşlemi
     */
    function handleQuery() {
        // Giriş değerlerini al
        const selectedWorld = worldSelect.value;
        const xCoord = xCoordInput.value.trim();
        const yCoord = yCoordInput.value.trim();
        
        // Validasyon
        if (!xCoord || !yCoord) {
            alert("X ve Y koordinatları zorunludur.");
            return;
        }
        
        // Sayısal değerlere dönüştür
        const x = parseFloat(xCoord);
        const y = parseFloat(yCoord);
        
        if (isNaN(x) || isNaN(y)) {
            alert("Koordinatlar sayısal değerler olmalıdır.");
            return;
        }
        
        // Sorgu öncesi sonuç alanını temizle
        queryResult.innerHTML = '';
        
        // Direk sonuca git
        setTimeout(() => {
            // Sonuçları hesapla
            const results = calculateResults(selectedWorld, x, y);
            
            // Sonuçları göster
            displayResults(selectedWorld, x, y, results);
            
            // Sonuca kaydır
            document.getElementById('result-area').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 500);
    }
    
    /**
     * Koordinat Sonuçlarını Hesaplama
     */
    function calculateResults(world, x, y) {
        // X ve Y koordinatlarını kullanarak daha anlamlı sonuçlar üretmek
        const sectorX = Math.floor(x / 10);
        const sectorY = Math.floor(y / 10);
        
        const sectorCode = `${sectorX}${sectorY}`;
        
        // Sektör tipi (X ve Y'e göre belirlenir)
        const getSectorType = () => {
            // X ve Y toplamının son basamağına göre bölge tipi belirle
            const sum = (x + y) % 10;
            switch(true) {
                case (sum < 2): return "Güvenli Bölge";
                case (sum < 4): return "Standart Bölge";
                case (sum < 6): return "Erişim Bölgesi";
                case (sum < 8): return "Merkez";
                default: return "Yasaklı Bölge";
            }
        };
        
        // Tehlike seviyesi (X koordinatı büyüdükçe artar)
        const getDangerLevel = () => {
            const level = Math.floor((Math.abs(x) / 100) * 5);
            switch(Math.min(level, 4)) {
                case 0: return "Çok Düşük";
                case 1: return "Düşük";
                case 2: return "Orta";
                case 3: return "Yüksek";
                case 4: return "Çok Yüksek";
                default: return "Bilinmiyor";
            }
        };
        
        // Kaynaklar (Y koordinatına bağlı)
        const getResources = () => {
            if (y < 0) return "Veri Kaynakları";
            if (y < 50) return "Enerji Kaynakları";
            if (y < 100) return "İşlem Gücü";
            if (y < 150) return "Depolama Birimleri";
            return "Kuantum Kaynakları";
        };
        
        // İklim/Durum (X ve Y'nin işaretine göre)
        const getStatus = () => {
            if (x >= 0 && y >= 0) return "İdeal";
            if (x >= 0 && y < 0) return "Değişken";
            if (x < 0 && y >= 0) return "Kararsız";
            return "Kritik";
        };
        
        // Nüfus (X ve Y'nin mutlak değerlerine göre)
        const getPopulation = () => {
            const pop = Math.floor(Math.abs(x * y) / 100);
            if (pop < 10) return "Az Yoğunluklu";
            if (pop < 100) return "Orta Yoğunluklu";
            if (pop < 1000) return "Yüksek Yoğunluklu";
            return "Çok Yüksek Yoğunluklu";
        };
        
        // Bölge kodu (koordinatlara göre gerçekçi bölge kodu)
        const regionCode = `${world.slice(0, 2).toUpperCase()}${Math.abs(sectorX)}${Math.abs(sectorY)}`;
        
        // Her dünya için daha anlamlı ve tutarlı veriler
        let details = {};
        switch(world) {
            case 'nora':
                details = {
                    konum: `${getSectorType()} ${sectorCode}`,
                    bölge_kodu: regionCode,
                    durum: getStatus(),
                    tehlike_seviyesi: getDangerLevel(),
                    nüfus: getPopulation(),
                    kaynaklar: getResources()
                };
                break;
            case 'nirus':
                details = {
                    konum: `${getSectorType()} ${sectorCode}`,
                    bölge_kodu: regionCode,
                    güvenlik: getDangerLevel() === "Çok Düşük" ? "En Üst Seviye" : 
                             getDangerLevel() === "Düşük" ? "Yüksek" : 
                             getDangerLevel() === "Orta" ? "Orta" : "Düşük",
                    teknoloji: Math.abs(x + y) % 2 === 0 ? "İleri Seviye" : "Temel Seviye",
                    erişim: getStatus() === "İdeal" ? "Tam Erişim" : 
                           getStatus() === "Değişken" ? "Kısıtlı Erişim" : "Erişim Yok",
                    protokol: "NR" + Math.abs(Math.floor(x/10)) + Math.abs(Math.floor(y/10))
                };
                break;
            case 'rumeli':
                details = {
                    konum: `${getSectorType()} ${sectorCode}`,
                    bölge_kodu: regionCode,
                    yönetim: getStatus() === "İdeal" ? "Merkezi Yönetim" : 
                             getStatus() === "Değişken" ? "Dağıtık Yönetim" : 
                             "Bağımsız Bölge",
                    yapı_tipi: Math.abs(x) % 3 === 0 ? "Siber Mimari" : 
                               Math.abs(x) % 3 === 1 ? "Klasik Yapı" : "Hibrit Yapı",
                    gelişmişlik: getPopulation(),
                    ticaret: getResources()
                };
                break;
            case 'zaidar':
                details = {
                    konum: `${getSectorType()} ${sectorCode}`,
                    bölge_kodu: regionCode,
                    teknoloji: Math.abs(x + y) % 4 + 1 + ". Nesil",
                    enerji: getResources(),
                    kararlılık: getStatus() === "İdeal" ? "%96" : 
                                getStatus() === "Değişken" ? "%78" : 
                                getStatus() === "Kararsız" ? "%45" : "%23",
                    nüfus: getPopulation()
                };
                break;
            case 'rodos':
                details = {
                    konum: `${getSectorType()} ${sectorCode}`,
                    bölge_kodu: regionCode,
                    su_durumu: getStatus() === "İdeal" ? "Temiz" : 
                               getStatus() === "Değişken" ? "Normal" : 
                               getStatus() === "Kararsız" ? "Kirli" : "Tehlikeli",
                    derinlik: Math.abs(y) + " metre",
                    canlı_türleri: Math.floor(Math.abs(x * y) / 50) + " tür",
                    tehlike: getDangerLevel()
                };
                break;
            case 'truva':
                details = {
                    konum: `${getSectorType()} ${sectorCode}`,
                    bölge_kodu: regionCode,
                    savunma: getDangerLevel(),
                    yapı: getStatus() === "İdeal" ? "Sağlam" : 
                          getStatus() === "Değişken" ? "Normal" : 
                          getStatus() === "Kararsız" ? "Zayıf" : "Yıkık",
                    hakimiyet: x > 0 && y > 0 ? "Müttefik Kontrol" : 
                               x > 0 && y < 0 ? "Bağımsız Bölge" : 
                               x < 0 && y > 0 ? "Tarafsız Bölge" : "Düşman Kontrol",
                    yerleşim: getPopulation()
                };
                break;
        }
        
        return details;
    }
    
    /**
     * Sonuçları Görüntüleme
     */
    function displayResults(world, x, y, results) {
        const formattedWorld = world.toUpperCase();
        const coords = `X: ${x} | Y: ${y}`;
        const accountName = "ekipkordi1";
        const proximity = "2000blok";
        const accountManager = "selami";
        
        // Sonuç HTML'i oluştur - istenen sırada ve kopyalama özelliği ile
        let resultHTML = `
            <div class="result-details">
                <div class="result-item" data-copy="${accountName}">
                    <span class="highlight">EN YAKIN HESAP:</span> ${accountName}
                </div>
                <div class="result-item" data-copy="${accountManager}">
                    <span class="highlight">HESAP SORUMLUSU:</span> ${accountManager}
                </div>
                <div class="result-item" data-copy="${coords}">
                    <span class="highlight">KOORDİNAT:</span> ${coords}
                </div>
                <div class="result-item" data-copy="${proximity}">
                    <span class="highlight">YAKINLIK:</span> ${proximity}
                </div>
                <div class="result-item" data-copy="${formattedWorld}">
                    <span class="highlight">DÜNYA:</span> ${formattedWorld}
                </div>
                
                <div class="message-template" data-copy="@${accountManager} ${accountName} bu hesaba girip ${formattedWorld} girer misin.">
                    @${accountManager} ${accountName} bu hesaba girip ${formattedWorld} girer misin.
                </div>
            </div>
        `;
        
        // Sonuçları göster
        queryResult.innerHTML = resultHTML;
        
        // Sonuçlar yüklendikten sonra kopyalama özelliğini ekle
        setupCopyFeature();
    }
    
    /**
     * Kopyalama Özelliği Ayarı
     */
    function setupCopyFeature() {
        const copyItems = document.querySelectorAll('.result-item, .message-template');
        
        copyItems.forEach(item => {
            item.addEventListener('click', function() {
                const textToCopy = this.getAttribute('data-copy');
                
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            // Tüm kopya öğelerden eski sınıfı kaldır
                            document.querySelectorAll('.copied').forEach(el => {
                                el.classList.remove('copied');
                            });
                            
                            // Bu öğeye kopyalandı efekti ekle
                            this.classList.add('copied');
                            
                            // 1 saniye sonra efekti kaldır
                            setTimeout(() => {
                                this.classList.remove('copied');
                            }, 1000);
                        })
                        .catch(err => {
                            console.error('Kopyalama başarısız oldu:', err);
                            alert('Kopyalama işlemi başarısız oldu.');
                        });
                }
            });
        });
    }
});
