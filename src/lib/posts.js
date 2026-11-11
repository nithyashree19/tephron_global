// Blog articles. Plain data (no imports) so the app and scripts/prerender.mjs
// can both read it. To add an article, add an entry here: it gets its own page,
// menu card, share tags and sitemap entry automatically.
//
// blocks: { t: "p", text } | { t: "h2", text } | { t: "ul", items: [...] }
// Keep claims honest: no statistics or client results unless you can back them up.

export const posts = [
  {
    slug: "scaling-offshore-support",
    title: "How to scale offshore customer support without losing quality",
    summary:
      "A practical guide to building dedicated chat and phone support teams that grow with your business while keeping service consistent.",
    date: "November 2026",
    readTime: "5 min read",
    tag: "Outsourcing strategy",
    blocks: [
      { t: "p", text: "Growing a customer support team in-house gets expensive and slow: hiring, training, and covering nights and weekends all take time. Many companies turn to an offshore partner, but the results depend far more on how the team is set up than on where it sits. These are the practices we recommend." },
      { t: "h2", text: "1. Define what good looks like before you hand anything over" },
      { t: "p", text: "Write down the outcomes you care about: how quickly customers should get a first reply, what counts as a resolved issue, and which topics must always go to your own staff. Agreed targets turn vague expectations into something both sides can measure." },
      { t: "h2", text: "2. Use a dedicated team, not a shared pool" },
      { t: "p", text: "A dedicated team learns your product, your tone of voice and your unusual cases. A shared pool that serves many clients rarely gets that deep. Even a small dedicated group usually does better than a larger rotating one, because the same people see the same problems repeatedly and get better at solving them." },
      { t: "h2", text: "3. Invest in training and written playbooks" },
      { t: "ul", items: [
        "A clear process for each common request, with examples of good replies",
        "Short refreshers whenever your product or policies change",
        "A shared place to record new answers, so the whole team learns from every tricky case",
      ] },
      { t: "h2", text: "4. Review results every week" },
      { t: "p", text: "Look at response times, resolution rates, customer satisfaction scores and a sample of real conversations. Weekly reviews catch small problems before customers notice them, and they give you a regular chance to adjust the process instead of waiting for a quarterly surprise." },
      { t: "h2", text: "5. Grow in steps" },
      { t: "p", text: "Start with one channel, such as chat or email. Prove the quality, then add volume or phone support. Scaling in steps keeps quality steady and lets you correct course early." },
      { t: "h2", text: "Protect your margins the right way" },
      { t: "p", text: "The aim is not to cut corners. Lower costs come from better processes, a stable team and less rework. A partner that keeps staff turnover low and quality high saves you money because customers get the right answer first time." },
      { t: "p", text: "If you are weighing up an offshore support team, we are happy to talk through what a dedicated setup could look like for your business." },
    ],
  },
  {
    slug: "24-7-airline-travel-booking-chat-desk",
    title: "How a 24/7 airline and travel booking chat desk works",
    summary:
      "What it takes to answer travellers at any hour: shift planning, clear procedures and careful record-keeping, so no booking request is dropped.",
    date: "October 2026",
    readTime: "7 min read",
    tag: "Travel support",
    blocks: [
      { t: "p", text: "Travel does not keep office hours. A passenger might need to change a flight in the middle of the night, or ask about a delayed connection while standing in an airport. A well-run chat desk makes sure someone is always ready, and that nothing falls through the cracks." },
      { t: "h2", text: "Shifts that follow the clock" },
      { t: "p", text: "Round-the-clock cover starts with scheduling. Teams are planned in shifts so that busy periods for each region are covered by people who are awake, trained and ready. Handovers between shifts are short and structured, so nothing is lost when one team finishes and the next begins." },
      { t: "h2", text: "Clear procedures for every common request" },
      { t: "p", text: "Most conversations fall into a handful of types. Each one needs a written procedure, so every agent handles it the same way and the traveller gets a consistent answer:" },
      { t: "ul", items: [
        "Changing or cancelling a booking",
        "Seat and baggage questions",
        "Delays, missed connections and rebooking",
        "Refund and credit queries",
      ] },
      { t: "h2", text: "Working inside booking systems carefully" },
      { t: "p", text: "Agents often work inside the airline’s or travel company’s booking systems. Good practice is to give each person access only to what they need, and to log every change so it can be checked later." },
      { t: "h2", text: "Keeping accurate records" },
      { t: "p", text: "A clear note on every conversation means the next agent, on any shift, can pick up exactly where the last one stopped. Travellers should never have to explain their situation twice." },
      { t: "h2", text: "Knowing when to hand over" },
      { t: "p", text: "Some situations need a decision from the airline or a supervisor. A good desk recognises these quickly, passes on the full details, and tells the traveller what happens next and when." },
      { t: "h2", text: "Measuring what matters" },
      { t: "p", text: "Track how fast the first reply arrives, how many requests are resolved in a single conversation, and how satisfied travellers are. Review the numbers weekly, and read real conversations too, because numbers alone hide the details." },
      { t: "p", text: "If you run a travel or airline business and want round-the-clock chat support, get in touch and we can talk through how a dedicated desk would work for you." },
    ],
  },
  {
    slug: "ai-needs-human-empathy",
    title: "Why AI in customer support still needs human empathy",
    summary:
      "Automation can sort and answer simple requests quickly. Here is where people make the difference, and how to combine both well.",
    date: "October 2026",
    readTime: "4 min read",
    tag: "Customer experience",
    blocks: [
      { t: "p", text: "Automated tools are good at sorting messages, suggesting replies and answering simple questions at any hour. But when a customer is worried, frustrated or facing something urgent, they usually want to know that a real person understands." },
      { t: "h2", text: "Let automation do the routine work" },
      { t: "p", text: "Tracking a parcel, resetting a password or finding an opening time rarely needs a person. Handling these quickly frees your team to spend time where it counts." },
      { t: "h2", text: "Keep people for the moments that matter" },
      { t: "ul", items: [
        "Complaints and upset customers",
        "Money, health or travel problems that cannot wait",
        "Situations that do not fit a standard answer",
        "Customers who simply ask for a person",
      ] },
      { t: "h2", text: "Make the hand-over seamless" },
      { t: "p", text: "When a conversation moves from automated to human, the person should see everything already said. Asking customers to repeat themselves is one of the fastest ways to lose their trust." },
      { t: "h2", text: "Language and local understanding" },
      { t: "p", text: "Customers respond best to people who speak their language naturally and understand local expressions and expectations. Training and local knowledge matter as much as the tools." },
      { t: "h2", text: "Review and keep improving" },
      { t: "p", text: "Read real conversations regularly. They show where automation helps, where it frustrates, and which questions should go to a person from the start." },
      { t: "p", text: "Used together, automation and well-trained people give customers speed and care. If you would like help building that balance, talk to our team." },
    ],
  },
];

export const getPost = (slug) => posts.find((p) => p.slug === slug);
