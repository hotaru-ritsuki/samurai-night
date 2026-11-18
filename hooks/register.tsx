import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENES } from './scenes'

// Matches T3 Code's "oni" theme: ink blacks, bone text, one blood-red accent.
// The backdrop is one of four still scenes built from public-domain art,
// changing every 20 minutes. Nothing animates, so it costs no CPU.
const { theme, problems } = makeColors({
  label: 'Oni',
  only: 'dark',
  roles: { accent: '#cf3a45', danger: '#e2553a', success: '#8fa58a', warning: '#c9a86a', pro: '#a08fb0' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0e0e0f',
        'surface-1': '#141415',
        'surface-2': '#1a1a1c',
        'surface-3': '#1f1f21',
        'text-primary': '#ece9e4',
        'text-secondary': '#c4c0b9',
        'text-muted': '#9a968f',
      },
    },
  },
})

const ROTATE_MS = 20 * 60 * 1000
let current = 0

const show = async ($: EngineInterface, index: number) => {
  current = ((index % SCENES.length) + SCENES.length) % SCENES.length
  const look: ThemeSetArgs = {
    colors: theme,
    backdrop: { scene: SCENES[current]?.id ?? 'torii-dusk', glass: { blur: 0, tint: '#0e0e0f', opacity: 0.4 } },
  }
  const set = await $.theme.set(look)

  if (!set.isDrawn) {
    $.ui.status(set.reason)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    await show($, Math.floor((await $.clock.now()) / ROTATE_MS))
    $.clock.every(ROTATE_MS, () => show($, current + 1))

    await $.command.register({
      name: 'scene',
      description: `Switch the backdrop: next, or one of ${SCENES.map(s => s.id).join(', ')}`,
    })

    return next(e)
  })

  on('command.run', { command: 'scene' }, async ($, e) => {
    const wanted = e.args.trim()
    const named = SCENES.findIndex(s => s.id === wanted)

    if (wanted !== '' && wanted !== 'next' && named === -1) {
      return { text: `No scene "${wanted}". Try: next, ${SCENES.map(s => s.id).join(', ')}` }
    }
    await show($, named === -1 ? current + 1 : named)

    return { text: `Scene: ${SCENES[current]?.id ?? ''}` }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const scene = SCENES.find(s => s.id === e.props.scene)

    if (scene === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={scene.svg} alt={scene.alt} isInteractive />
  })
}
