export const STREAK_MILESTONES = [
  {
    id: 'streak-1',
    days: 1,
    badge: '🌱',
    name: 'First Step',
    message: 'You showed up — that\'s everything. The journey of a thousand sessions begins right here.',
    color: '#7a9e7e',
    colorLight: '#e8f0e9',
  },
  {
    id: 'streak-3',
    days: 3,
    badge: '🌸',
    name: 'Blossoming',
    message: 'Three days in a row — you\'re building something beautiful, Kathryn. Keep blooming.',
    color: '#c17f5a',
    colorLight: '#f5ede5',
  },
  {
    id: 'streak-7',
    days: 7,
    badge: '🌿',
    name: 'One Full Week',
    message: 'A whole week of showing up for yourself. Your body and mind are already changing in ways you can\'t yet see.',
    color: '#4a6b4e',
    colorLight: '#d4e8d5',
  },
  {
    id: 'streak-14',
    days: 14,
    badge: '✨',
    name: 'Fortnight Flow',
    message: 'Two weeks strong! What started as effort is becoming habit. You\'re becoming a Pilates practitioner.',
    color: '#9b8ec4',
    colorLight: '#eeedfe',
  },
  {
    id: 'streak-21',
    days: 21,
    badge: '🦋',
    name: 'Transformation',
    message: '21 days — science says a habit is formed. But you already knew that. Feel the difference in your body.',
    color: '#5a8fa8',
    colorLight: '#e3f0f7',
  },
  {
    id: 'streak-30',
    days: 30,
    badge: '🏆',
    name: 'Monthly Champion',
    message: '30 days! A full month of dedication. Kathryn, you are an inspiration. This is what commitment looks like.',
    color: '#b8860b',
    colorLight: '#fdf3d0',
  },
  {
    id: 'streak-60',
    days: 60,
    badge: '🌟',
    name: 'Radiant',
    message: 'Two months of consistent practice. You\'ve built something most people only dream about. You are radiant.',
    color: '#c17f5a',
    colorLight: '#faeee5',
  },
  {
    id: 'streak-100',
    days: 100,
    badge: '👑',
    name: 'Pilates Queen',
    message: '100 days! You are extraordinary, Kathryn. 100 days of choosing yourself — this is your crown to wear.',
    color: '#7a6e5a',
    colorLight: '#f0ebe1',
  },
]

export function checkNewMilestones(streak, earned) {
  return STREAK_MILESTONES.filter(
    m => streak >= m.days && !earned.includes(m.id)
  )
}

export function getEarnedMilestones(streak, earned) {
  return STREAK_MILESTONES.filter(m => earned.includes(m.id))
}

export function getNextMilestone(streak, earned) {
  return STREAK_MILESTONES.find(m => !earned.includes(m.id) && streak < m.days)
}
