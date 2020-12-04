import {
  Author,
  Embed,
  Field,
  Footer,
  Img,
  RenderingMessage,
  Reaction,
  Thumbnail,
  Title,
  Reactions,
  Renderer,
  forwardEvent,
} from "../index";
import * as React from "react";
import { Client, TextChannel } from "discord.js";

const client = new Client();
const cid = "494780225280802819";
class Resource {
  get() {
    if (!this.promise) {
      this.load();
    }
    if (this.loaded) {
      return "にゃーん";
    }
    throw this.promise;
  }
  load() {
    this.promise = new Promise<void>((resolve) =>
      setTimeout(() => {
        this.loaded = true;
        resolve();
      }, 2000)
    );
  }
  promise?: Promise<void>;
  loaded = false;
}
async function ready() {
  const renderer = new Renderer(() => client.user);
  const forward = forwardEvent(client, renderer);
  Renderer.requiredEvents.forEach(forward);
  const resouce = new Resource();
  resouce.load();
  const LazyTitle: React.FC = () => {
    const v = resouce.get();
    return <Title url="https://example.com">{v}</Title>;
  };
  const message = (
    <RenderingMessage>
      テスト
      <Embed color={0xff0000} timestamp={true}>
        <React.Suspense fallback={<Title>にゃーん</Title>}>
          <LazyTitle></LazyTitle>
        </React.Suspense>
        Desc
        <Author
          url="https://twitter.com/_tig_"
          icon="https://pbs.twimg.com/profile_images/1256452981282574336/n7cjUb3q_400x400.jpg"
        >
          Author
        </Author>
        <Footer icon="https://pbs.twimg.com/profile_images/1256452981282574336/n7cjUb3q_400x400.jpg">
          Footer
        </Footer>
        <Field name="Filed Name">Field Value</Field>
        <Field name="Inline Field" inline={true}>
          Inline Field Value
        </Field>
        <Thumbnail src="https://homepages.cae.wisc.edu/~ece533/images/airplane.png"></Thumbnail>
        <Img src="https://homepages.cae.wisc.edu/~ece533/images/arctichare.png"></Img>
      </Embed>
      <Reactions
        strategy="remote"
        onReactionRemoveAll={(...rest) => console.log("onReactionRemoveAll")}
      >
        <Reaction
          onReactionAdd={(...rest) =>
            console.log("onReactionAdd", rest[0].emoji.name)
          }
          onReactionRemove={(...rest) =>
            console.log("onReactionRemove", rest[0].emoji.name)
          }
          onReactionRemoveEmoji={(...rest) =>
            console.log("onReactionRemoveEmoji", rest[0].emoji.name)
          }
        >
          ❤
        </Reaction>
        <Reaction
          onReactionAdd={(...rest) =>
            console.log("onReactionAdd", rest[0].emoji.name)
          }
          onReactionRemove={(...rest) =>
            console.log("onReactionRemove", rest[0].emoji.name)
          }
          onReactionRemoveEmoji={(...rest) =>
            console.log("onReactionRemoveEmoji", rest[0].emoji.name)
          }
        >
          ✔
        </Reaction>
      </Reactions>
    </RenderingMessage>
  );
  await renderer.render(message, client.channels.resolve(cid) as TextChannel);
}
client.on("ready", () => {
  ready().catch((err) => console.log(err));
});
// eslint-disable-next-line @typescript-eslint/no-floating-promises
client.login(process.env.DISCORD_BOT_TOKEN);
