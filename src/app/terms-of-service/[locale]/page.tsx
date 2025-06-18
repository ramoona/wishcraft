import { readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { ContentLayout } from "~/components/layout/Layout";
import { languages, SupportedLanguages } from "~/lib/i18n/settings";
import { TermsOfServiceLanguageSwitcher } from "~/app/terms-of-service/[locale]/LanguageSwitcher";

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const paramsResolved = await params;
  const locale = languages.includes(paramsResolved.locale as SupportedLanguages)
    ? (paramsResolved.locale as SupportedLanguages)
    : "en";
  const filePath = path.join(process.cwd(), "content", "terms-of-service", `${locale}.md`);
  const file = await readFile(filePath, "utf8");
  const { content } = matter(file);
  const html = marked(content);

  return (
    <ContentLayout langSwitcher={<TermsOfServiceLanguageSwitcher lang={locale} />}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ContentLayout>
  );
}
