{/* ─── YENİ RADAR GRAFİKLİ MEVCUT DURUM ANALİZİ ─── */}
        <div className="bg-[#1a3a2a]/30 p-6 rounded-[30px] border border-[#ffd369]/20 shadow-lg mb-8 relative overflow-hidden">
          <h2 className="text-xl font-extrabold mb-2 text-[#f7e6ae]">Mevcut Durum Analizi</h2>
          <p className="text-xs text-[#f7e6ae]/60 mb-6">İlim dallarındaki dengenizi ve gelişim grafiğinizi inceleyin.</p>
          
          {/* Saf SVG Radar Grafiği Motoru */}
          <div className="relative w-full aspect-square flex items-center justify-center max-w-[280px] mx-auto my-4">
            <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
              {/* Arka Plan Kılavuz Çizgileri (%25, %50, %75, %100 Halkaları) */}
              {[0.25, 0.50, 0.75, 1.0].map((scale, sIdx) => {
                const points = stats.map((_, i) => {
                  const angle = (i * 2 * Math.PI) / stats.length;
                  const x = 100 + 80 * scale * Math.cos(angle);
                  const y = 100 + 80 * scale * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polygon
                    key={sIdx}
                    points={points}
                    fill="none"
                    stroke="#ffd369"
                    strokeWidth="0.5"
                    strokeOpacity={sIdx === 3 ? "0.4" : "0.15"}
                    strokeDasharray={sIdx !== 3 ? "2,2" : "0"}
                  />
                );
              })}

              {/* Merkezden Köşelere Giden Eksen Çizgileri */}
              {stats.map((_, i) => {
                const angle = (i * 2 * Math.PI) / stats.length;
                const x = 100 + 80 * Math.cos(angle);
                const y = 100 + 80 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={x}
                    y2={y}
                    stroke="#ffd369"
                    strokeWidth="0.5"
                    strokeOpacity="0.2"
                  />
                );
              })}

              {/* DİNAMİK KULLANICI VERİ ALANI (Veritabanından gelen skorlara göre şekil alır) */}
              <polygon
                points={stats.map((stat, i) => {
                  const angle = (i * 2 * Math.PI) / stats.length;
                  // Skor 0-100 arası normalize edilir, max yarıçap 80 birimdir
                  const radius = 80 * (stat.score / 100);
                  const x = 100 + radius * Math.cos(angle);
                  const y = 100 + radius * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ')}
                fill="rgba(255, 211, 105, 0.25)"
                stroke="#ffd369"
                strokeWidth="2"
                className="animate-pulse"
                style={{ transformOrigin: '100px 100px' }}
              />

              {/* Veri Noktaları (Köşe Dotları) */}
              {stats.map((stat, i) => {
                const angle = (i * 2 * Math.PI) / stats.length;
                const radius = 80 * (stat.score / 100);
                const x = 100 + radius * Math.cos(angle);
                const y = 100 + radius * Math.sin(angle);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="#032212"
                    stroke="#ffd369"
                    strokeWidth="1.5"
                  />
                );
              })}
            </svg>

            {/* Metin Etiketleri (SVG dışında, kayma yapmaması için mutlak pozisyonlu HTML) */}
            {stats.map((stat, i) => {
              const angle = (i * 2 * Math.PI) / stats.length;
              // Etiketleri çemberin biraz daha dışına taşımak için 112 çarpanı kullanıldı
              const x = 50 + 46 * Math.cos(angle);
              const y = 50 + 46 * Math.sin(angle);
              return (
                <div
                  key={i}
                  className="absolute text-[11px] font-black tracking-wide text-[#f7e6ae] bg-[#032212]/90 border border-[#ffd369]/20 px-2 py-0.5 rounded-md shadow-sm"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {stat.name} <span className="text-[#ffd369] font-bold ml-0.5">{stat.score}%</span>
                </div>
              );
            })}
          </div>

          {/* Dengeli Durum Analiz Özeti */}
          <div className="mt-4 pt-4 border-t border-[#ffd369]/10 text-center">
            <span className="text-[11px] text-[#ffd369] bg-[#ffd369]/10 px-3 py-1 rounded-full font-semibold">
              🎯 En Güçlü Alan: { [...stats].sort((a,b) => b.score - a.score)[0].name }
            </span>
          </div>
        </div>