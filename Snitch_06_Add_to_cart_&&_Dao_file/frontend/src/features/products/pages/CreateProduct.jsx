import { useState } from "react";
import { useProduct } from "../hooks/useProduct";
import ProductForm from "../components/ProductForm";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priceAmount, setPriceAmount] = useState("");
    const [priceCurrency, setPriceCurrency] = useState("INR");
    const [images, setImages] = useState([]); // Array of { file, preview }
    const [stock, setStock] = useState("");
    const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 7) {
            toast.warning("Maximum 7 images allowed");
            return;
        }

        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(prev => {
            const updated = prev.filter((_, i) => i !== index);
            // URL.revokeObjectURL(prev[index].preview); // Should clean up
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("priceAmount", priceAmount);
            formData.append("priceCurrency", priceCurrency);
            formData.append("stock", stock);

            // Convert attributes array to object format
            const filteredAttributes = attributes.filter(a => a.key.trim() && a.value.trim());
            if (filteredAttributes.length > 0) {
                const attributesObject = Object.fromEntries(
                    filteredAttributes.map(a => [a.key.trim(), a.value.trim()])
                );
                formData.append("attributes", JSON.stringify(attributesObject));
            }

            images.forEach((img) => {
                formData.append("images", img.file);
            });

            await handleCreateProduct(formData);
            navigate('/');
        } catch (error) {
            console.error("Failed to create product", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--theme-bg)] transition-colors duration-500 overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Back Link */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-3 text-[var(--theme-text-muted)] hover:text-primary transition-all duration-300 group mb-12"
                >
                    <div className="w-10 h-10 rounded-full border border-[var(--theme-border)] flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Return to Grid</span>
                </button>

                <ProductForm 
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    priceAmount={priceAmount}
                    setPriceAmount={setPriceAmount}
                    priceCurrency={priceCurrency}
                    setPriceCurrency={setPriceCurrency}
                    stock={stock}
                    setStock={setStock}
                    attributes={attributes}
                    setAttributes={setAttributes}
                    images={images}
                    handleImageChange={handleImageChange}
                    removeImage={removeImage}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
};

export default CreateProduct;