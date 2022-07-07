import Head from "next/head";
import { FC } from "react";

type Props = {
  title?: string;
  description?: string;
};

const CustomHead: FC<Props> = ({ title, description }) => {
  const titleContent = title
    ? `${title} - Skylab`
    : "Skylab - The Platform powering NUS Orbital";
  const descriptionContent =
    description ??
    "Orbital provides a platform for students to gain hands-on industrial experience for computing technologies related to students’ own interests. Done in pairs of two, Orbital students propose, design, execute, implement and market their project to peers and faculty. Peer assessment and critique of others’ projects are key components of the modules’ deliverables.";
  const url = window.location.href;
  const imageLink = "https://imgur.com/Nq3N8Jc";

  return (
    <Head>
      {/* <!-- Primary Meta Tags --> */}
      <title>{titleContent}</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="title" content={titleContent} />
      <meta name="description" content={descriptionContent} />

      {/* <!-- Open Graph / Facebook --> */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={titleContent} />
      <meta property="og:description" content={descriptionContent} />
      <meta property="og:image" content={imageLink} />

      {/* <!-- Twitter --> */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={titleContent} />
      <meta property="twitter:description" content={descriptionContent} />
      <meta property="twitter:image" content={imageLink}></meta>
    </Head>
  );
};
export default CustomHead;
