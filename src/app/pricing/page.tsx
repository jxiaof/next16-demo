export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "¥0",
      desc: "适合个人用户",
      features: ["基础功能", "5GB 存储", "邮件支持"],
    },
    {
      name: "Pro",
      price: "¥99/月",
      desc: "适合专业用户",
      features: ["所有基础功能", "100GB 存储", "优先支持", "API 访问"],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "联系我们",
      desc: "适合企业团队",
      features: ["所有 Pro 功能", "无限存储", "专属客服", "自定义集成"],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Pricing</h1>
        <p className="mt-1 text-muted-foreground">选择适合你的方案</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border p-6 ${
              plan.popular ? "border-primary" : ""
            }`}
          >
            {plan.popular && (
              <span className="mb-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                推荐
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-sm text-muted-foreground">{plan.desc}</p>
            <p className="mt-4 text-3xl font-bold">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button className="mt-6 w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              开始使用
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
