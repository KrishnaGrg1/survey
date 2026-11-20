'use client'

import * as React from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Switch } from '#/components/ui/switch'
import { TrashIcon, GripVerticalIcon, PlusIcon } from 'lucide-react'

import type { Question, Condition } from '#/lib/schema/survey'

type QuestionDraft = Question & { options?: { id: string; label: string }[] }

interface QuestionEditorProps {
  question: QuestionDraft
  index: number
  allQuestions: QuestionDraft[]
  onChange: (question: QuestionDraft) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function QuestionEditor({
  question,
  index,
  allQuestions,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: QuestionEditorProps) {
  const [local, setLocal] = React.useState(question)

  React.useEffect(() => {
    setLocal(question)
  }, [question])

  const update = <K extends keyof QuestionDraft>(
    key: K,
    value: QuestionDraft[K],
  ) => {
    const next = {
      ...local,
      [key]: value,
    }

    setLocal(next)
    onChange(next)
  }

  const addOption = () => {
    const optionId = `opt_${Math.random().toString(36).slice(2, 9)}`

    update('options', [...(local.options ?? []), { id: optionId, label: '' }])
  }

  const updateOption = (optionId: string, label: string) => {
    update(
      'options',
      (local.options ?? []).map((opt) =>
        opt.id === optionId ? { ...opt, label } : opt,
      ),
    )
  }

  const removeOption = (optionId: string) => {
    update(
      'options',
      (local.options ?? []).filter((opt) => opt.id !== optionId),
    )
  }

  return (
    <div className="island-shell rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVerticalIcon className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Question {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onMoveUp}
            disabled={index === 0}
          >
            ↑
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onMoveDown}
            disabled={index === allQuestions.length - 1}
          >
            ↓
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon-xs"
            onClick={onRemove}
          >
            <TrashIcon className="size-3" />
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Question Type</Label>
          <Select
            value={local.type}
            onValueChange={(value) => update('type', value as Question['type'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="single_choice">Multiple Choice</SelectItem>
              <SelectItem value="multi_choice">Checkbox</SelectItem>
              <SelectItem value="rating">Rating Scale (1–5)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label>Label</Label>
          <Input
            value={local.label}
            onChange={(e) => update('label', e.target.value)}
            placeholder="Enter your question"
          />
        </div>

        {(local.type === 'single_choice' || local.type === 'multi_choice') && (
          <div className="sm:col-span-2 space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {local.options?.map((option, optionIndex) => (
                <div key={option.id} className="flex items-center gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeOption(option.id)}
                  >
                    <TrashIcon className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
            >
              <PlusIcon className="size-4" />
              Add Option
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Switch
            checked={local.required}
            onCheckedChange={(checked) => update('required', checked)}
          />
          <Label>Required</Label>
        </div>

        <div className="space-y-2">
          <Label>Show only when (optional)</Label>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={local.showIf?.questionId ?? ''}
              onValueChange={(questionId) =>
                update('showIf', {
                  questionId,
                  operator: local.showIf?.operator ?? 'equals',
                  value: local.showIf?.value ?? '',
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question" />
              </SelectTrigger>
              <SelectContent>
                {allQuestions
                  .filter((q) => q.id !== local.id)
                  .map((q) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {local.showIf && (
              <>
                <Select
                  value={local.showIf.operator}
                  onValueChange={(operator) => {
                    if (!local.showIf) return

                    update('showIf', {
                      ...local.showIf,
                      operator: operator as Condition['operator'],
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="not_equals">Not equals</SelectItem>
                    <SelectItem value="includes">Includes</SelectItem>
                    <SelectItem value="gte">Greater than or equal</SelectItem>
                    <SelectItem value="lte">Less than or equal</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={String(local.showIf.value ?? '')}
                  onChange={(e) => {
                    if (!local.showIf) return

                    update('showIf', {
                      ...local.showIf,
                      value:
                        local.showIf.operator === 'gte' ||
                        local.showIf.operator === 'lte'
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }}
                  placeholder="Value"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
