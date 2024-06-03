import { motion } from "framer-motion";
import React, { useState } from "react";

import PricingCard from "./components/pricing-card";
import PricingHeader from "./components/pricing-header";
import PricingSwitch from "./components/pricing-switch";

export function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const togglePricingPeriod = (value: string) => {
    setIsYearly(Number.parseInt(value) === 1);
  };

  const plans = [
    {
      title: "Pro版",
      monthlyPrice: 9.9,
      yearlyPrice: 99,
      description: "只需 10 元, 半杯奶茶的价格。",
      features: ["会员模板免费使用", "可同时管理多份简历", "更多简历的排版设计功能"],
      actionLabel: "升级高级会员",
    },
    {
      title: "ProMax版",
      monthlyPrice: 19.9,
      yearlyPrice: 188,
      description: "AI 能力加持",
      features: [
        "自动AI生成求职信/打招呼内容",
        "更多行业一键AI补全简历模板",
        "AI分析简历，助力更快找到工作",
      ],
      actionLabel: "升级高级会员",
      popular: true,
    },
    {
      title: "合作咨询",
      price: "Custom",
      description: "其他需求点这里，比如定制化服务",
      features: ["定制化需求", "其他产品需求开发", "广告投放合作"],
      actionLabel: "联系我",
      exclusive: true,
    },
  ];
  return (
    <div className="mt-10 py-10">
      <PricingHeader
        title="升级为高级会员"
        subtitle="秉承简单的传统，定价机制透明并且价格低廉。所有服务都是单次付费，不会自动续费。"
      />
      <PricingSwitch onSwitch={togglePricingPeriod} />

      <section className="mt-8 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {plans.map((plan, index) => {
          return (
            <motion.div
              viewport={{ once: true }}
              initial={{ opacity: 0, x: 100 }}
              // whileInView={{ opacity: 1, x: 0 }}
              whileInView={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
            >
              <PricingCard key={plan.title} {...plan} isYearly={isYearly} />
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
