// src/db/seed.ts   run: npm run seed
import { prisma } from '#/db'
import { auth } from '#/lib/auth'

import 'dotenv/config'
// import { prisma } from '../lib/db'
// import { hashPassword } from '../lib/auth'
// import { createSurvey, setStatus } from '../services/surveys'

async function main() {
  const email = 'admin@test.com'
  const password = 'superadmin123'

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('Admin already exists')
    return
  }

  const data = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: 'Admin',
    },
  })
  console.log('Admin created successfully', data)

  const s = await prisma.survey.create({
    data: {
      title: 'Product feedback demo',
      slug: 'product-feedback-demo',
      description:
        'A short demo survey showing every question type and conditional logic.',
      versions: {
        create: {
          version: 1,
          schema: {
            questions: [
              {
                id: 'q_use',
                type: 'single_choice',
                label: 'Do you use our product?',
                required: true,
                options: [
                  { id: 'yes', label: 'Yes' },
                  { id: 'no', label: 'No' },
                ],
              },
              {
                id: 'q_features',
                type: 'multi_choice',
                label: 'Which features do you use?',
                required: false,
                showIf: {
                  questionId: 'q_use',
                  operator: 'equals',
                  value: 'yes',
                },
                options: [
                  { id: 'dash', label: 'Dashboard' },
                  { id: 'api', label: 'API' },
                  { id: 'rep', label: 'Reports' },
                ],
              },
              {
                id: 'q_rate',
                type: 'rating',
                label: 'How satisfied are you?',
                required: true,
                showIf: {
                  questionId: 'q_use',
                  operator: 'equals',
                  value: 'yes',
                },
              },
              {
                id: 'q_why',
                type: 'text',
                label: 'What could be better?',
                required: true,
                showIf: { questionId: 'q_rate', operator: 'lte', value: 3 },
              },
              {
                id: 'q_no',
                type: 'text',
                label: 'Why not?',
                required: false,
                showIf: {
                  questionId: 'q_use',
                  operator: 'equals',
                  value: 'no',
                },
              },
            ],
          },
        },
      },
    },
  })
  // await setStatus(s.id, 'published')
  await prisma.survey.update({
    where: { id: s.id },
    data: { status: 'published' },
  })
  console.log('Seeded. Public link: /s/' + s.slug)
}
main().finally(() => prisma.$disconnect())
