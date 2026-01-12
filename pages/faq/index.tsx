import { ApiServiceBuilder, consumeSSEStream } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { GetFaqConversationsResponse, HTTP_METHOD } from "@/types/api";
import { Add, AttachFile, KeyboardVoice } from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import FaqLayout from "@/components/layout/Faq/Faq";

const Qna = () => {
  const router = useRouter();

  const createNewConversation = async (content: string) => {
    const apiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/ai/faq",
      body: { content },
      requiresAuthorization: true,
      stream: true,
    }).build();

    const response = await apiService();

    await consumeSSEStream(response, {
      onMeta: ({ conversationId }) => {
        router.push(
          `/faq/${conversationId}?draft=${encodeURIComponent(content)}`
        );
      },
    });
  };

  return (
    <FaqLayout>
      {/* Logo + Title */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img
          src="/skylab-logo.png"
          alt="Skylab Logo"
          style={{ width: "100px", margin: "auto" }}
        />

        <h2 style={{ fontWeight: 700, margin: 0, fontSize: "1.8rem" }}>
          Ask anything about Orbital
        </h2>
        <p style={{ color: "#666", marginTop: "0.25rem" }}>
          Get answers about milestones, requirements, or programme structure.
        </p>
      </div>

      {/* Formik input */}
      <Formik
        initialValues={{ content: "" }}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          try {
            await createNewConversation(values.content);
            resetForm();
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form
            style={{
              width: "100%",
              maxWidth: "680px",
              borderRadius: "12px",
              padding: "0.9rem 1.2rem",
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              background: "#f2f2f2",
              boxShadow: "0px 0px 0px 1px #e0e0e0 inset",
            }}
          >
            <AttachFile style={{ fontSize: "1.3rem", opacity: 0.7 }} />
            <Add style={{ fontSize: "1.4rem", opacity: 0.75 }} />

            <input
              name="content"
              type="text"
              placeholder="Ask a question…"
              value={values.content}
              onChange={handleChange}
              disabled={isSubmitting}
              style={{
                flexGrow: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                background: "transparent",
              }}
            />

            <KeyboardVoice style={{ fontSize: "1.4rem", opacity: 0.75 }} />

            <button
              type="submit"
              disabled={isSubmitting || !values.content.trim()}
              style={{
                padding: "6px 14px",
                border: "1px solid #000",
                background: "#fff",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Send
            </button>
          </Form>
        )}
      </Formik>
    </FaqLayout>
  );
};

export default Qna;
