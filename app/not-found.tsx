import { Section, Container } from "@/components/craft";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-4xl font-bold">{`404 - Page Not Found`}</h1>
          <p className="mb-8">
            {`Ooops you seem to be lost. Let's get you back on track.`}
          </p>
          <Button asChild className="not-prose mt-6">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
