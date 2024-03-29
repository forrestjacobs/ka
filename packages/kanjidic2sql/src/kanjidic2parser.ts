import { Character } from "@ka/base";
import { parser, QualifiedTag, SAXParser, Tag } from "sax";
import { Transform } from "stream";

type BaseCharacter = Pick<
  Character,
  "strokeCount" | "radicalNames" | "on" | "kun" | "meaning" | "nanori"
>;

const START_TEXT = "<kanjidic2>";

function makeBaseCharacter(): BaseCharacter {
  return {
    strokeCount: [],
    radicalNames: [],
    on: [],
    kun: [],
    meaning: [],
    nanori: []
  };
}

export class KanjiDic2Parser extends Transform {
  private readonly saxParser: SAXParser;
  private currentCharacter: Partial<Character> &
    BaseCharacter = makeBaseCharacter();
  private startBuffer?: string = "";

  public constructor() {
    super({ readableObjectMode: true });

    const saxParser = parser(false, { trim: true, lowercase: true });
    this.saxParser = saxParser;

    let currentNode: Tag | QualifiedTag;

    saxParser.onerror = (error): void => {
      this.emit("error", error);
    };
    saxParser.onopentag = (node): void => {
      currentNode = node;
    };
    saxParser.ontext = (text): void => {
      this.updateCharacterFromElement(
        currentNode.name,
        currentNode.attributes,
        text
      );
    };
    saxParser.onclosetag = (tagName): void => {
      if (tagName === "character") {
        if (this.currentCharacter.nelsonRadical === undefined) {
          this.currentCharacter.nelsonRadical = this.currentCharacter.radical;
        }
        this.push(this.currentCharacter);
        this.currentCharacter = makeBaseCharacter();
      }
    };
  }

  public _transform(
    chunk: string,
    encoding: string,
    callback: () => void
  ): void {
    // Ignore everything up until "<kanjidic2>"
    if (this.startBuffer !== undefined) {
      const buf: string = this.startBuffer + chunk;
      const start = buf.indexOf(START_TEXT);
      if (start === -1) {
        this.startBuffer = buf.substr(-START_TEXT.length);
      } else {
        this.saxParser.write(buf.substr(start));
        this.startBuffer = undefined;
      }
    } else {
      this.saxParser.write(chunk);
    }
    callback();
  }

  public _flush(callback: (error?: Error, data?: unknown) => void): void {
    this.saxParser.close();
    callback();
  }

  private updateCharacterFromElement(
    name: string,
    attr: unknown,
    text: string
  ): void {
    switch (name) {
      case "literal":
        this.currentCharacter.literal = text;
        break;
      case "grade":
        this.currentCharacter.grade = +text;
        break;
      case "freq":
        this.currentCharacter.freq = +text;
        break;
      case "jlpt":
        this.currentCharacter.jlpt = +text;
        break;
      case "stroke_count":
        this.currentCharacter.strokeCount.push(+text);
        break;
      case "rad_name":
        this.currentCharacter.radicalNames.push(text);
        break;
      case "nanori":
        this.currentCharacter.nanori.push(text);
        break;
      case "rad_value":
        this.updateCharacterFromRadValue(attr as { rad_type: string }, text);
        break;
      case "reading":
        this.updateCharacterFromReading(attr as { r_type: string }, text);
        break;
      case "meaning":
        if ((attr as { m_lang?: string }).m_lang === undefined) {
          this.currentCharacter.meaning.push(text);
        }
        break;
    }
  }

  private updateCharacterFromRadValue(
    attr: { rad_type: string },
    text: string
  ): void {
    switch (attr.rad_type) {
      case "classical":
        this.currentCharacter.radical = +text;
        break;
      case "nelson_c":
        this.currentCharacter.nelsonRadical = +text;
        break;
    }
  }

  private updateCharacterFromReading(
    attr: { r_type: string },
    text: string
  ): void {
    switch (attr.r_type) {
      case "ja_on":
        this.currentCharacter.on.push(text);
        break;
      case "ja_kun":
        this.currentCharacter.kun.push(text);
        break;
    }
  }
}
