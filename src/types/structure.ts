
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
  tkContext: string | CstttContextNode;
  tkSubject: string | CstttSubjectNode;
  tkOther: string | CstttOtherNode;
}

/**
 * 结构树的成分级：背景节点
 */
export type CstttContextNode = {
  id: string;
  label: string;
  expanded: boolean;
  sending: boolean;
  content: (PhraseThingNode | ClauseNode)[];
}

/**
 * 结构树的成分级：主语节点
 */
export type CstttSubjectNode = {
  id: string;
  label: string;
  expanded: boolean;
  sending: boolean;
  content: PhraseThingNode[];
}

/**
 * 结构树的成分级：其他节点
 */
export type CstttOtherNode = {
  id: string;
  label: string;
  expanded: boolean;
  sending: boolean;
  content: PredicatePlaceholderNode;
}

/**
 * 谓语级：TODO
 */
export type PredicatePlaceholderNode = {
  id: string;
  label: string;
  expanded: boolean;
  sending: boolean;
}

/**
 * 短语级：事物短语 TODO 待完善
 */
export type PhraseThingNode = {
  id: string;
  label: string;
  expanded: boolean;
  sending: boolean;
}

/**
 * 从句：TODO 待完善
 */
export type ClauseNode = {
  id: string;
  label: string;
  expanded: boolean;
  sending: boolean;
}