import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function CategoryView() {
    const { name } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:8000/api/categories')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error al obtener las categorías');
                }
                return res.json();
            })
            .then(data => {
                const categories = Array.isArray(data) ? data : (data.data || []);
                // Buscar la categoría por nombre (ignorando mayúsculas/minúsculas)
                const foundCategory = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
                
                setCategory(foundCategory);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [name]);

    if (loading) return <div style={{ padding: '20px', textAlign: 'center', minHeight: '60vh' }}>Cargando...</div>;
    if (!category) return <div style={{ padding: '20px', textAlign: 'center', minHeight: '60vh' }}>Categoría "{name}" no encontrada</div>;

    return (
        <div className="category-view" style={{ padding: '20px', minHeight: '60vh' }}>
            <h1>{category.name}</h1>
            <div className="category-description">
                <p>{category.description}</p>
            </div>
        </div>
    );
}
export default CategoryView;