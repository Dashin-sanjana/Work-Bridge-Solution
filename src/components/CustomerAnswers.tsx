import type { CustomerAnswer } from "../data/servicePages";

export default function CustomerAnswers({ answers }: { answers: CustomerAnswer[] }) {
  return <section className="section section-muted"><div className="container customer-answers"><h2>Customer questions</h2>{answers.map(answer => <article key={answer.question}><h3>{answer.question}</h3><p>{answer.answer}</p></article>)}</div></section>;
}
