import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ClipboardList,
  ChartNoAxesCombined,
  Users,
  Zap,
  ShieldCheck,
  GitBranch,
  CheckCircle2,
  Plus,
  Sparkles,
  MousePointerClick,
  BarChart3,
  MessageSquareText,
} from 'lucide-react'

import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: ClipboardList,
      title: 'Easy Survey Creation',
      description:
        'Create beautiful surveys with different question types, options, and custom settings.',
    },
    {
      icon: GitBranch,
      title: 'Conditional Questions',
      description:
        'Show or hide questions dynamically based on previous answers for smarter surveys.',
    },
    {
      icon: ChartNoAxesCombined,
      title: 'Response Analytics',
      description:
        'Understand your audience with organized responses and meaningful insights.',
    },
    {
      icon: Users,
      title: 'Audience Friendly',
      description:
        'Give respondents a clean, simple, and responsive experience on every device.',
    },
    {
      icon: ShieldCheck,
      title: 'Reliable Data',
      description:
        'Collect and manage survey submissions in one organized place.',
    },
    {
      icon: Zap,
      title: 'Fast and Simple',
      description:
        'Build, publish, and share surveys without complicated workflows.',
    },
  ]

  const steps = [
    {
      number: '01',
      title: 'Create your survey',
      description:
        'Add a title, description, and the questions you want to ask.',
      icon: Plus,
    },
    {
      number: '02',
      title: 'Customize questions',
      description:
        'Choose question types and configure conditional visibility.',
      icon: MousePointerClick,
    },
    {
      number: '03',
      title: 'Publish and share',
      description:
        'Publish your survey and share its unique link with respondents.',
      icon: MessageSquareText,
    },
    {
      number: '04',
      title: 'Analyze responses',
      description: 'Review submitted answers and discover useful insights.',
      icon: BarChart3,
    },
  ]

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative px-4 pb-20 pt-20 md:pb-28 md:pt-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="rise-in">
            <div className="island-kicker mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smarter survey management
            </div>

            <h1 className="display-title text-5xl font-bold leading-[1.12] tracking-tight md:text-7xl">
              Turn questions into
              <span className="block text-[#328f97]">meaningful insights.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--sea-ink-soft)] md:text-lg">
              Create engaging surveys, collect valuable feedback, and understand
              your audience with a simple and powerful survey management
              platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="rounded-xl bg-[#328f97] px-6 text-white hover:bg-[#246f76]"
                onClick={() => navigate({ to: '/admin/surveys/new' })}
              >
                Create a survey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-[#328f97]/30 px-6"
                onClick={() => navigate({ to: '/admin/surveys' })}
              >
                Explore surveys
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-[var(--sea-ink-soft)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#328f97]" />
                Easy to use
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#328f97]" />
                Responsive design
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#328f97]" />
                Smart logic
              </span>
            </div>
          </div>

          {/* HERO PREVIEW */}
          <div className="relative rise-in">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#4fb8b2]/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[#2f6a4a]/15 blur-3xl" />

            <div className="island-shell relative rounded-3xl p-5 shadow-xl md:p-7">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="island-kicker">Survey preview</p>
                  <h3 className="mt-2 text-xl font-bold">Customer Feedback</h3>
                </div>
                <span className="rounded-full bg-[#4fb8b2]/15 px-3 py-1 text-xs font-semibold text-[#328f97]">
                  Published
                </span>
              </div>

              <div className="space-y-5">
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="mb-3 text-sm font-semibold">
                    How would you rate our service?
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold ${
                          n === 5
                            ? 'border-[#328f97] bg-[#328f97] text-white'
                            : 'border-[var(--line)]'
                        }`}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                  <p className="mb-3 text-sm font-semibold">
                    Would you recommend us?
                  </p>

                  {['Definitely', 'Maybe', 'Not really'].map(
                    (option, index) => (
                      <div
                        key={option}
                        className="mb-2 flex items-center gap-3 text-sm"
                      >
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            index === 0
                              ? 'border-[#328f97] bg-[#328f97] ring-2 ring-[#328f97]/20'
                              : 'border-[var(--sea-ink-soft)]/40'
                          }`}
                        />
                        {option}
                      </div>
                    ),
                  )}
                </div>

                <div className="rounded-xl bg-[#328f97]/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--sea-ink-soft)]">
                        Survey status
                      </p>
                      <p className="mt-1 font-semibold">
                        Ready to collect responses
                      </p>
                    </div>
                    <ClipboardList className="h-8 w-8 text-[#328f97]" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs text-[var(--sea-ink-soft)]">
                <span>Designed for better feedback</span>
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Smart surveys
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="island-kicker">Powerful features</p>
            <h2 className="display-title mt-3 text-4xl font-bold md:text-5xl">
              Everything you need to
              <span className="text-[#328f97]"> collect insights.</span>
            </h2>
            <p className="mt-4 leading-7 text-[var(--sea-ink-soft)]">
              From creating your first question to understanding responses,
              everything is designed to make your workflow easier.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="feature-card rounded-2xl border border-[var(--line)] p-6 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4fb8b2]/15 text-[#328f97]">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-[var(--sea-ink-soft)]">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="island-shell rounded-3xl p-7 md:p-12">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="island-kicker">Simple workflow</p>
              <h2 className="display-title mt-3 text-4xl font-bold md:text-5xl">
                From idea to insight
                <span className="text-[#328f97]"> in four steps.</span>
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => {
                const Icon = step.icon

                return (
                  <div key={step.number}>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="text-3xl font-bold text-[#328f97]/50">
                        {step.number}
                      </span>
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4fb8b2]/15 text-[#328f97]">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <h3 className="font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--sea-ink-soft)]">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 pt-12">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#173a40] px-6 py-16 text-center text-white md:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#4fb8b2]/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#2f6a4a]/30 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <Sparkles className="mx-auto mb-5 h-8 w-8 text-[#60d7cf]" />

            <h2 className="display-title text-4xl font-bold md:text-5xl">
              Ready to create your first survey?
            </h2>

            <p className="mt-5 leading-8 text-white/70">
              Start collecting meaningful feedback and turn your questions into
              better decisions.
            </p>

            <Button
              size="lg"
              className="mt-8 rounded-xl bg-[#60d7cf] px-7 text-[#173a40] hover:bg-[#8de5db]"
              onClick={() => navigate({ to: '/admin/surveys/new' })}
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
