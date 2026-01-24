import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD } from "@/types/api";
import {
  AddOutlined,
  ArrowUpwardOutlined,
  KeyboardVoiceOutlined,
} from "@mui/icons-material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import FaqLayout from "@/components/layout/Faq";
import {
  Box,
  Button,
  IconButton,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";

const Qna = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const createNewConversation = async (content: string) => {
    const apiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/ai/faq",
      body: { content },
      requiresAuthorization: true,
      stream: true,
    }).build();

    const response = await apiService();
    const { conversation } = await response.json();

    router.push(`/faq/${conversation.id}?draft=${encodeURIComponent(content)}`);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <FaqLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
          alignItems: "center",
          width: "100%",
          marginBottom: "12rem",
        }}
      >
        {/* Logo + Title */}
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Box
              component="img"
              src="/skylab-logo.png"
              alt="Skylab Logo"
              sx={{
                width: 120,
                margin: "auto",
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: "1.7rem",
                margin: 0,
              }}
            >
              Ask anything about Orbital
            </Typography>

            <Typography variant="body2" sx={{ color: "#666" }}>
              Get answers about milestones, requirements, or programme
              structure.
            </Typography>
          </Box>
        </Box>

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
            <Form>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "800px",
                  borderRadius: 40,
                  padding: "0.9rem 1.15rem",
                  display: "flex",
                  gap: "0.rem",
                  alignItems: "center",
                  background: "#f5f5f5",
                }}
              >
                <Tooltip title="Add attachments">
                  <IconButton>
                    <AddOutlined />
                  </IconButton>
                </Tooltip>
                <TextareaAutosize
                  ref={inputRef}
                  name="content"
                  value={values.content}
                  onChange={handleChange}
                  placeholder="Ask a question"
                  minRows={1}
                  maxRows={6}
                  disabled={isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (!isSubmitting && values.content.trim()) {
                        (
                          e.currentTarget as HTMLTextAreaElement
                        ).form?.dispatchEvent(
                          new Event("submit", {
                            bubbles: true,
                            cancelable: true,
                          })
                        );
                      }
                    }
                  }}
                  style={{
                    flexGrow: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    resize: "none",
                    padding: "6px 0",
                  }}
                />

                <Tooltip title="Voice">
                  <IconButton>
                    <KeyboardVoiceOutlined />
                  </IconButton>
                </Tooltip>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !values.content.trim()}
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    padding: 0,
                    // enabled
                    bgcolor: "#000",
                    color: "#fff",

                    "&:hover": {
                      bgcolor: "#000",
                    },

                    // disabled
                    "&.Mui-disabled": {
                      bgcolor: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  <ArrowUpwardOutlined />
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </FaqLayout>
  );
};

export default Qna;
