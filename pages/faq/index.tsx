import { useRouter } from "next/router";
import React from "react";
import FaqLayout from "@/components/layout/Faq";
import Body from "@/components/layout/Body";
import CustomHead from "@/components/layout/CustomHead";
import HeroFaq from "@/components/Hero/HeroFaq";
import InputBar from "@/components/faq/InputBar";
import useFaq from "@/contexts/useFaq";
import { PAGES } from "@/helpers/navigation";

const Faq = () => {
  const router = useRouter();
  const { addConversation } = useFaq();

  // Create a new conversation
  const createNewConversation = async (content: string) => {
    const newConversation = await addConversation(content);
    router.push(
      `${PAGES.FAQ}/${newConversation.id}?draft=${encodeURIComponent(content)}`
    );
  };

  return (
    <Body
      isLoading={false}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.2rem",
      }}
    >
      <CustomHead
        title="FAQ Assistant"
        description="Skylab's AI-powered assistant answers questions about Orbital: projects, milestones, grading and more."
      />
      {/* --- FAQ HERO --- */}
      <HeroFaq />
      {/* --- INPUT BAR --- */}
      <InputBar
        isLoadingMessage={false}
        onSend={createNewConversation}
        position="relative"
      />
    </Body>
  );
};

Faq.getLayout = (page: React.ReactNode) => <FaqLayout>{page}</FaqLayout>;

export default Faq;