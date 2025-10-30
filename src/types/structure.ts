
export type ParagraphNode = {
  // id: string; // 默认为 "root"
  input: string;
  sending: boolean;

  // sentenceNodes: SentenceNodeEntry[]
}

/**
 * 结构树的句子级，包含字符串或者已解析的成分级结构
 */
export type SentenceNodeEntry = {
  id: string;
  summary: string;
  expanded: boolean;
  sending: boolean;
  tkContext: string | ConstituentContextNode;
  tkSubject: string;
  tkOther: string;
}

/**
 * 结构树的成分级 TODO
 */
export type ConstituentContextNode = {

}
