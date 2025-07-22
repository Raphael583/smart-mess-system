export function getCurrentMealType(): 'Breakfast' | 'Lunch' | 'Dinner' {
  const hour = new Date().getHours();
  if (hour < 10) return 'Breakfast';
  else if (hour < 15) return 'Lunch';
  else return 'Dinner';
}
