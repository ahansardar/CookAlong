import { RequestRecipeForm } from "@/components/request-recipe-form";
import { SiteHeader } from "@/components/site-header";
import Link from "next/link";
import { ArrowLeft, MessageSquare, CheckCircle2 } from "lucide-react";
export default function RequestRecipePage() {
  return (
    <>
      <SiteHeader />
      <main className="shell request-page">
        <Link href="/#recipes" className="back-link">
          <ArrowLeft size={16} /> Back to the recipe book
        </Link>
        <div className="request-layout">
          <section className="request-intro">
            <p className="eyebrow">SOMETHING MISSING FROM THE MENU?</p>
            <h1>
              Tell us what
              <br />
              you're <em>craving.</em>
            </h1>
            <p>
              A family favourite, a dish you've been meaning to try, or
              something you can't find in the recipe book.
            </p>
            <div className="request-info">
              <MessageSquare size={20} />
              <div>
                <h2>A little detail helps</h2>
                <p>
                  Share the dish name and any ingredients or style you have in
                  mind.
                </p>
              </div>
            </div>
            <div className="request-info">
              <CheckCircle2 size={20} />
              <div>
                <h2>We'll take a look</h2>
                <p>
                  Every suggestion is considered. Submitting a request doesn't
                  guarantee it will be added.
                </p>
              </div>
            </div>
            <p className="small-note">
              Up to 3 requests per hour. Your email is used for your recipe
              request, not displayed in the recipe book.
            </p>
          </section>
          <RequestRecipeForm />
        </div>
      </main>
    </>
  );
}
