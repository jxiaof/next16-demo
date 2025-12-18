import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "¥0",
      period: "永久免费",
      desc: "适合个人用户体验",
      features: [
        { text: "基础功能", included: true },
        { text: "5GB 存储空间", included: true },
        { text: "邮件支持", included: true },
        { text: "API 访问", included: false },
        { text: "高级分析", included: false },
      ],
      buttonText: "免费开始",
      buttonVariant: "outline" as const,
    },
    {
      name: "Pro",
      price: "¥99",
      period: "/月",
      desc: "适合专业用户和小团队",
      features: [
        { text: "所有基础功能", included: true },
        { text: "100GB 存储空间", included: true },
        { text: "优先客服支持", included: true },
        { text: "API 访问", included: true },
        { text: "高级分析", included: true },
      ],
      buttonText: "升级 Pro",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "联系我们",
      period: "",
      desc: "适合大型企业团队",
      features: [
        { text: "所有 Pro 功能", included: true },
        { text: "无限存储空间", included: true },
        { text: "专属客户经理", included: true },
        { text: "自定义集成", included: true },
        { text: "SLA 保障", included: true },
      ],
      buttonText: "联系销售",
      buttonVariant: "outline" as const,
    },
  ];

  const faqs = [
    {
      q: "可以随时取消订阅吗？",
      a: "是的，您可以随时取消订阅，无需任何额外费用。",
    },
    {
      q: "支持哪些支付方式？",
      a: "我们支持支付宝、微信支付、银行卡等多种支付方式。",
    },
    {
      q: "有试用期吗？",
      a: "Pro 版本提供 14 天免费试用，无需绑定支付方式。",
    },
  ];

  return (
    <div className="space-y-12">
      {/* 页面标题 */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold md:text-3xl">选择适合你的方案</h1>
        <p className="text-muted-foreground">
          简单透明的定价，无隐藏费用
        </p>
      </div>

      {/* 定价卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${
              plan.popular ? "border-primary shadow-md" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  最受欢迎
                </span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.desc}</CardDescription>
              <div className="pt-4">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-2">
                    {feature.included ? (
                      <span className="text-primary">✓</span>
                    ) : (
                      <span className="text-muted-foreground/50">✗</span>
                    )}
                    <span
                      className={
                        feature.included ? "" : "text-muted-foreground/50"
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.buttonVariant}
                asChild
              >
                <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                  {plan.buttonText}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-center text-xl font-semibold">常见问题</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardHeader>
                <CardTitle className="text-base">{faq.q}</CardTitle>
                <CardDescription>{faq.a}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-lg bg-muted p-6 text-center md:p-10">
        <h2 className="text-xl font-semibold">还有疑问？</h2>
        <p className="mt-2 text-muted-foreground">
          联系我们的销售团队，获取专属方案
        </p>
        <Button className="mt-4" variant="outline" asChild>
          <Link href="/contact">联系我们</Link>
        </Button>
      </div>
    </div>
  );
}
