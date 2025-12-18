export default function MarketPage() {
  const products = [
    { id: 1, name: "产品 A", price: "¥99", desc: "产品描述信息" },
    { id: 2, name: "产品 B", price: "¥199", desc: "产品描述信息" },
    { id: 3, name: "产品 C", price: "¥299", desc: "产品描述信息" },
    { id: 4, name: "产品 D", price: "¥399", desc: "产品描述信息" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Market</h1>
        <p className="mt-1 text-muted-foreground">浏览所有产品</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border p-4 transition-colors hover:border-primary"
          >
            {/* 图片占位 */}
            <div className="aspect-square rounded-md bg-muted" />
            <div className="mt-3">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.desc}</p>
              <p className="mt-2 font-semibold">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
