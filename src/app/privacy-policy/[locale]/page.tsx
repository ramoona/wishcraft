import { readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { ContentLayout } from "~/components/layout/Layout";
import { languages, SupportedLanguages } from "~/lib/i18n/settings";
import { PrivacyPolicyLanguageSwitcher } from "~/app/privacy-policy/[locale]/LanguageSwitcher";

export default async function PrivacyPolicyPage({ params }: { params: { locale: string } }) {
  const locale = languages.includes(params.locale as SupportedLanguages) ? (params.locale as SupportedLanguages) : "en";
  const filePath = path.join(process.cwd(), "content", "privacy-policy", `${locale}.md`);
  const file = await readFile(filePath, "utf8");
  const { content } = matter(file);
  const html = marked(content);

  return (
    <ContentLayout langSwitcher={<PrivacyPolicyLanguageSwitcher lang={locale} />}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </ContentLayout>
  );
}
