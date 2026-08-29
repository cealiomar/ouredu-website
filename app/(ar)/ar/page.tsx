import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "تعليمنا — كل نظام تحتاجه مؤسستك",
  description:
    "القبول والنقل والمحتوى والدروس الخاصة والاستعداد للاختبارات والتدريب وإدارة المنظمات الخيرية. ثلاثة عشر نظامًا من شركة سعودية واحدة.",
  alternates: { canonical: "/ar", languages: { en: "/", ar: "/ar" } },
};

export default function HomeAr() {
  return <HomePage lang="ar" />;
}
