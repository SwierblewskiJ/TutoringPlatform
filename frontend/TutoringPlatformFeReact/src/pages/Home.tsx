import { useEffect, useState } from "react";
import type { TutoringAd } from "../types/TutoringAds";
import { fetchData } from "../services/ApiService";
import AdCard from "../components/AdCard";


const Home = () => {
    const [ads, setAds] = useState<TutoringAd[]>([]);
    const [search,setSearch] = useState('');
    const [onlyOnline, setOnlyOnline] = useState(false);
    const [maxPrice, setMaxPrice] = useState<number | ''>('');

    const fetchAds = async () => {
        try{
            const params = new URLSearchParams();
            if(search) params.append('search',search);
            if(onlyOnline) params.append('isOnline','true');
            if(maxPrice) params.append('maxPrice', maxPrice.toString());

            const data = await fetchData<TutoringAd[]>(`/Ads?${params.toString()}`);
            setAds(data);
        } catch (err){
            console.error("Błąd przy pobieraniu ofert: ", err);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAds();
        },300);
        return () => clearTimeout(timer);
    }, [search, onlyOnline, maxPrice]);


    return (
        <div className="home-layout">
            <aside className="filters">
                <h3>Filtry</h3>
                <div className="filter-group">
                    <label>Szukaj</label>
                    <input type="text"
                            className="form-input" 
                            placeholder="np. Analiza 2..."
                            onChange={(e) => setSearch(e.target.value)}/>
                </div>

                <div className="filter-group">
                    <label>Cena do (zł/h)</label>
                    <input type="number" className="form-input" onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')} />
                </div>

                <div className="filter-group checkbox">
                    <input type="checkbox" id="online" onChange={(e) => setOnlyOnline(e.target.checked)} />
                    <label htmlFor="online">Tylko online</label>
                </div>
            </aside>

            <main className="ads-grid">
                {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </main>
        </div>
    );
}
export default Home;