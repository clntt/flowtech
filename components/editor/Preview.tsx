import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  lightSelector: "html.light",
  light: "github-light",
  dark: "github-dark",
};

export const Preview = ({ content }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section className=" grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => <Code {...props} lineNumbers className="" />,
        }}
      />
    </section>
  );
};

export default Preview;
