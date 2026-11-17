import { createServerFn } from '@tanstack/react-start'
import { ensureSession } from './auth.service'
import { createSurveySchema, getSurveyByIdSchema } from '../schema/survey'
import { prisma } from '#/db'

export const createSurvey = createServerFn({ method: 'POST' })
  .validator((data) => createSurveySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
      const survey = await prisma.survey.create({
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          versions: {
            create: {
              version: 1,
              schema: {
                questions: data.questions,
              },
            },
          },
        },
        include: {
          versions: true,
        },
      })
      return {
        success: true,
        message: 'Created survey successfully',
        data: survey,
      }
    } catch (error: any) {
      console.error(
        'create survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })

  export const getAllsurveys=createServerFn({method:'GET'})
  .handler(async () => {
    try{
      await ensureSession()
      const surveys=await prisma.survey.findMany()
      return {
        success: true,
        message: 'Get all survey successfully',
        data: surveys,
      }
    }catch (error: any) {
      console.error(
        'get survery error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })



    export const getSurveyById=createServerFn({method:'GET'})
      .validator((data) => getSurveyByIdSchema.parse(data))
  .handler(async ({data}) => {
    try{
      await ensureSession()
      const surveys=await prisma.survey.findUnique({
        where:{
          id:data.id
        }
      })
      return {
        success: true,
        message: 'Get survey successfully',
        data: surveys,
      }
    }catch (error: any) {
      console.error(
        'get survery error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })


  export const updateSurvey = createServerFn({ method: 'POST' })
  .validator((data) => createSurveySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
const survery=await prisma.survey.findUnique({
  where:{
    slug:data.slug
  }
})
if (!survery){
  throw new Error("Survery not found to update")
}
      const updatedSurvey = await prisma.survey.update({
        where:{
          slug:data.slug
        },
        data: {
          title: data.title,
          slug: data.slug,
          description: data.description,
          versions: {
            create: {
              version: survery.currentVersion+1,
              schema: {
                questions: data.questions,
              },
            },
          },
        },
        include: {
          versions: true,
        },
      })
      return {
        success: true,
        message: 'updated survey successfully',
        data: updatedSurvey,
      }
    } catch (error: any) {
      console.error(
        'create survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })


   export const deleteSurvey = createServerFn({ method: 'POST' })
  .validator((data) => getSurveyByIdSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
const survery=await prisma.survey.findUnique({
  where:{
    id:data.id
  }
})
if (!survery){
  throw new Error("Survery not found to update")
}
 await prisma.survey.delete({
        where:{
          id:data.id
        },

      })
      return {
        success: true,
        message: 'deleted  survey successfully',

      }
    } catch (error: any) {
      console.error(
        'create survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })

 export const publishSurvey = createServerFn({ method: 'POST' })
  .validator((data) => getSurveyByIdSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await ensureSession()
const survery=await prisma.survey.findUnique({
  where:{
  id:data.id
  }
})
if (!survery){
  throw new Error("Survery not found to update")
}
      const updatedSurvey = await prisma.survey.update({
        where:{
     id:data.id
        },
        data: {
          status:"published"
        },

      })
      return {
        success: true,
        message: 'published survey successfully',
        data: updatedSurvey,
      }
    } catch (error: any) {
      console.error(
        'create survey error',
        error?.response?.status,
        error?.response?.data,
      )
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          'failed to create survey',
      )
    }
  })