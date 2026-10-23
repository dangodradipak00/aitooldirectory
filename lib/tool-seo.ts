export function getToolSeoTitle(toolName: string) {
  return `${toolName || '{Tool}'}: Features, Pricing, Pros and Cons`;
}

export function getToolSeoDescription(toolName: string) {
  return `Learn what ${toolName || '{Tool}'} is, who should use it, how it works, key features, pricing plans, pros, cons and popular use cases. Read the complete guide.`;
}
