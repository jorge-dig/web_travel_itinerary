import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-6">Nuevo producto</h1>
      <ProductForm />
    </div>
  );
}
