import { useEffect, useMemo, useRef, useState } from 'react' // Bu React'e özel fonksiyonlardır (hook) react olası degısıklıklere karsı kendını yeniden render etmesini sağlarlar.
import { initialDrones } from '../data/mockDrones.js'


export function useLiveDrones() {
  const [drones, setDrones] = useState(initialDrones) // UseState fonksiyonu bize bir deger ile o sayıyı degistiren fonksıyon dondurur ve drones değişkeninin içine initalDrones listesi atandı.
  const [selectedId, setSelectedId] = useState(initialDrones[0]?.id ?? null) // SelectedID seçili drone'un id'si tutulmaya calısılıyor,initialDrones[0]?.id kısmı eger ilk drone varsa onun id'sini al,id ?? null kısmı ise eger boşsa null koy demek. ? olma durumu, ?? olmama durumunu ifade eder.
  const [isRefreshing, setIsRefreshing] = useState(false) // isRefreshing sayfanın yenilenme durumunu tutar ilk başta false yani yenilenmiyor,setIsRefreshing ise yenileten fonksiyondur.
  const timerRef = useRef(null) // useRef arka planda bir sayac tutar ve bu sayac her degıstıgınde useState'e nazaran sayfa tekrar renderlanmamasını saglar ve degıskenıne current ile erişilir.

  useEffect(() => { // 
    timerRef.current = setInterval(() => { // setInternal,belirli aralıklarda kodu tekrar tekrar calıstır demek sonda da suresı verılıyor burada 1.5 sn
      setDrones(prev => // prev ilk liste degerinin kopyası,orjınal listeyi degıstırmez sadece kopya uzerınden degısıklık yapar ve onu döndürür.
        prev.map(d => { // prev yani ilk liste içindeki butun degerlerı tek tek gez map ile ve her bırının ismi d olsun.
          // Basit simulasyon: rasgele yön ve küçük hareket
          const dx = (Math.random() - 0.5) * 0.02
          const dy = (Math.random() - 0.5) * 0.02
          const speed = Math.max(0, d.speed + (Math.random() - 0.5) * 3)
          const altitude = Math.max(0, d.altitude + (Math.random() - 0.5) * 5)
          const statusRand = Math.random() // Bir rastgele sayı üret ve bu rastgele sayı uzerınden status ayarla tamamen rastgele.
          let status = d.status
          if (statusRand > 0.985) status = 'alert'
          else if (statusRand > 0.94) status = 'idle'
          else status = 'online'

          return { ...d, lat: d.lat + dx, lng: d.lng + dy, speed, altitude, status } // ılk lıstenın kopyasındakı butun elemanların tek tek degerlerını guncelle ve yenı lıste elemanlarını dondur. ilk olarak daha oncekı butun ozellıklerı kopyala (...d) kısmı,sonra 
        })
      )
    }, 1500)
    return () => clearInterval(timerRef.current) // Component kapanınca sayac eski degerınden devam etmemesi,sızıntı yapmaması adına temizlik işlemi yapıldı.
  }, [])

  const refresh = async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 500))
    setIsRefreshing(false)
  }

  const selectedDrone = useMemo(
    () => drones.find(d => d.id === selectedId) ?? null,
    [drones, selectedId]
  )

  return { drones, refresh, isRefreshing, selectedId, setSelectedId, selectedDrone }
}