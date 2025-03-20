import { getAllCategories } from "@/lib/wordpress";

export async function CategoriesList() {
  const categories = await getAllCategories();

  return (
    <>
      <option value="">全部分类</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </>
  );
}
