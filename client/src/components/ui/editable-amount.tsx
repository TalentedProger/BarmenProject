import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditableAmountProps {
  amount: number;
  unit: string;
  minAmount?: number;
  maxAmount?: number;
  step?: number;
  onAmountChange: (newAmount: number) => void;
  className?: string;
  displayUnit?: string; // Для отображения (например, "г" вместо "kg")
  glassCapacity?: number; // Емкость стакана в ml
  currentTotalVolume?: number; // Текущий общий объем всех ингредиентов
  ingredientIndex?: number; // Индекс текущего ингредиента (для логики первого ингредиента)
}

export function EditableAmount({
  amount,
  unit,
  minAmount = 5,
  maxAmount = 1000,
  step = 5,
  onAmountChange,
  className,
  displayUnit,
  glassCapacity,
  currentTotalVolume = 0,
  ingredientIndex
}: EditableAmountProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Форматируем отображаемое значение
  const formatDisplayValue = () => {
    if (unit === 'kg') {
      return `${Math.round(amount * 1000)} ${displayUnit || 'г'}`;
    }
    return `${Math.round(amount)} ${displayUnit || unit}`;
  };

  const handleClick = () => {
    setIsEditing(true);
    // Устанавливаем текущее числовое значение для редактирования
    const currentValue = unit === 'kg' ? Math.round(amount * 1000) : Math.round(amount);
    setInputValue(currentValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Разрешаем только цифры
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
  };

  const handleSubmit = () => {
    let numericValue = parseInt(inputValue) || minAmount;
    
    // Делаем значения кратными 5
    if (unit === 'kg') {
      // Для фруктов в граммах: минимум 10г, кратно 5
      numericValue = Math.max(10, Math.ceil(numericValue / 5) * 5);
    } else {
      // Для жидкостей в мл: минимум 5мл, кратно 5  
      numericValue = Math.max(5, Math.ceil(numericValue / 5) * 5);
    }
    
    // Применяем стандартные ограничения
    let finalValue = Math.max(minAmount, Math.min(maxAmount, numericValue));
    
    // Проверяем ограничение по емкости стакана (только для жидкостей)
    if (glassCapacity && unit !== 'kg') {
      const currentAmount = Math.round(amount);
      const otherIngredientsVolume = currentTotalVolume - currentAmount;
      
      // Логика для первого ингредиента vs последующих
      let maxAllowedAmount;
      if (ingredientIndex === 0) {
        // Первый ингредиент может занять весь стакан
        maxAllowedAmount = glassCapacity;
      } else {
        // Последующие ингредиенты ограничены оставшимся местом
        maxAllowedAmount = glassCapacity - otherIngredientsVolume;
      }
      
      if (maxAllowedAmount > 0) {
        // Также делаем максимальное значение кратным 5
        const roundedMaxAmount = Math.floor(maxAllowedAmount / 5) * 5;
        finalValue = Math.min(finalValue, Math.max(5, roundedMaxAmount));
      }
    }
    
    // Если единица kg, конвертируем граммы обратно в кг
    if (unit === 'kg') {
      finalValue = finalValue / 1000;
    }
    
    onAmountChange(finalValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  // Фокус на инпут при переходе в режим редактирования
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className={cn("relative", className)}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            "w-12 h-6 text-xs font-medium text-center",
            "bg-blue-500/20 border border-blue-400/50 rounded-sm",
            "text-blue-400 placeholder:text-blue-300/60",
            "focus:outline-none focus:border-blue-300 focus:bg-blue-500/30",
            "backdrop-blur-sm transition-all duration-300 ease-in-out"
          )}
          placeholder="0"
        />
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "min-w-[40px] h-6 px-2 py-1",
        "bg-blue-500/10 border border-blue-400/30 rounded-sm",
        "text-xs font-medium text-center text-blue-500",
        "cursor-pointer hover:bg-blue-500/20 hover:border-blue-400/50",
        "backdrop-blur-sm transition-all duration-300 ease-in-out",
        "flex items-center justify-center",
        "hover:shadow-sm hover:shadow-blue-400/25",
        className
      )}
      onClick={handleClick}
      title="Кликните для изменения объема" 
      data-testid="editable-amount"
    >
      {formatDisplayValue()}
    </div>
  );
}