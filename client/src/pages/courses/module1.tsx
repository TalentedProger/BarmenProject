import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { MODULE_1, type Lesson, type TestQuestion } from "@/data/course-module1";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Check, 
  ChevronRight,
  ChevronLeft,
  Play,
  FileText,
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ListChecks,
  Send,
  RotateCcw
} from "lucide-react";

// Simple markdown-like renderer
function renderContent(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={key++} className="list-disc list-inside text-cream space-y-2 mb-4 ml-4">
            {listItems.map((item, i) => <li key={i} className="text-cream">{item}</li>)}
          </ul>
        );
      } else {
        elements.push(
          <ol key={key++} className="list-decimal list-inside text-cream space-y-2 mb-4 ml-4">
            {listItems.map((item, i) => <li key={i} className="text-cream">{item}</li>)}
          </ol>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Empty line
    if (trimmedLine === '') {
      flushList();
      continue;
    }

    // Headers
    if (trimmedLine.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-lg font-bold text-neon-amber mt-6 mb-3">
          {trimmedLine.slice(4)}
        </h3>
      );
      continue;
    }
    if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-neon-purple mt-8 mb-4">
          {trimmedLine.slice(3)}
        </h2>
      );
      continue;
    }
    if (trimmedLine.startsWith('# ')) {
      flushList();
      elements.push(
        <h1 key={key++} className="text-2xl font-bold text-neon-turquoise mb-4">
          {trimmedLine.slice(2)}
        </h1>
      );
      continue;
    }

    // Blockquote
    if (trimmedLine.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={key++} className="border-l-4 border-neon-turquoise pl-4 my-4 italic text-cream/80 bg-white/5 py-2 rounded-r">
          {trimmedLine.slice(2)}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (trimmedLine === '---' || trimmedLine === '***') {
      flushList();
      elements.push(<hr key={key++} className="border-white/20 my-8" />);
      continue;
    }

    // Unordered list
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      inList = true;
      listItems.push(formatInlineText(trimmedLine.slice(2)));
      continue;
    }

    // Ordered list
    const orderedMatch = trimmedLine.match(/^(\d+)\.\s/);
    if (orderedMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      inList = true;
      listItems.push(formatInlineText(trimmedLine.slice(orderedMatch[0].length)));
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={key++} className="text-cream mb-4 leading-relaxed">
        {formatInlineText(trimmedLine)}
      </p>
    );
  }

  flushList();
  return elements;
}

// Format inline text (bold, italic, code)
function formatInlineText(text: string): React.ReactNode {
  // Simple implementation - handle **bold** and *italic* and `code`
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Check for bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(remaining.slice(0, boldMatch.index));
      }
      parts.push(
        <strong key={key++} className="text-white font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Check for italic (single asterisk, not at word boundary)
    const italicMatch = remaining.match(/\*([^*]+?)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(remaining.slice(0, italicMatch.index));
      }
      parts.push(
        <em key={key++} className="text-neon-turquoise/80">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // Check for inline code
    const codeMatch = remaining.match(/`([^`]+)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) {
        parts.push(remaining.slice(0, codeMatch.index));
      }
      parts.push(
        <code key={key++} className="bg-white/10 px-2 py-1 rounded text-neon-amber text-sm">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }

    // No more matches, add rest of text
    parts.push(remaining);
    break;
  }

  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

type ModuleStep = 'overview' | 'lesson' | 'test' | 'practice' | 'complete';

interface ModuleProgress {
  lessonsCompleted: number[];
  testScore: number | null;
  testAttempts: number;
  practiceSubmitted: boolean;
  practiceData: string | null;
}

export default function CourseModule1() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Navigation state
  const [currentStep, setCurrentStep] = useState<ModuleStep>('overview');
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  // Progress state
  const [progress, setProgress] = useState<ModuleProgress>({
    lessonsCompleted: [],
    testScore: null,
    testAttempts: 0,
    practiceSubmitted: false,
    practiceData: null
  });
  
  // Test state
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<{ correct: number; total: number; passed: boolean } | null>(null);
  
  // Practice state
  const [practiceText, setPracticeText] = useState("");
  const [isPracticeSubmitting, setIsPracticeSubmitting] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('course_module_1_progress');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setProgress(parsed);
      if (parsed.testScore !== null) {
        setTestSubmitted(true);
        setTestResults({
          correct: Math.round(parsed.testScore * MODULE_1.test.questions.length / 100),
          total: MODULE_1.test.questions.length,
          passed: parsed.testScore >= MODULE_1.test.passingScore
        });
      }
      if (parsed.practiceData) {
        setPracticeText(parsed.practiceData);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress: ModuleProgress) => {
    setProgress(newProgress);
    localStorage.setItem('course_module_1_progress', JSON.stringify(newProgress));
  };

  // Calculate overall progress percentage
  const calculateProgress = () => {
    const lessonWeight = 60; // 60% for lessons
    const testWeight = 25; // 25% for test
    const practiceWeight = 15; // 15% for practice
    
    const lessonProgress = (progress.lessonsCompleted.length / MODULE_1.lessons.length) * lessonWeight;
    const testProgress = progress.testScore !== null && progress.testScore >= MODULE_1.test.passingScore ? testWeight : 0;
    const practiceProgress = progress.practiceSubmitted ? practiceWeight : 0;
    
    return Math.round(lessonProgress + testProgress + practiceProgress);
  };

  // Mark lesson as complete
  const completeLesson = (lessonId: number) => {
    if (!progress.lessonsCompleted.includes(lessonId)) {
      const newCompleted = [...progress.lessonsCompleted, lessonId];
      saveProgress({ ...progress, lessonsCompleted: newCompleted });
    }
  };

  // Navigate to next lesson
  const nextLesson = () => {
    completeLesson(MODULE_1.lessons[currentLessonIndex].id);
    
    if (currentLessonIndex < MODULE_1.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      window.scrollTo(0, 0);
    } else {
      // All lessons completed, go to test
      setCurrentStep('test');
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous lesson
  const prevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit test
  const submitTest = () => {
    const questions = MODULE_1.test.questions;
    let correct = 0;
    
    questions.forEach(q => {
      if (testAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= MODULE_1.test.passingScore;
    
    setTestResults({ correct, total: questions.length, passed });
    setTestSubmitted(true);
    
    const newProgress = {
      ...progress,
      testScore: score,
      testAttempts: progress.testAttempts + 1
    };
    saveProgress(newProgress);
    
    if (passed) {
      toast({
        title: "🎉 Поздравляем!",
        description: `Вы успешно прошли тест с результатом ${score}%!`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Попробуйте ещё раз",
        description: `Ваш результат: ${score}%. Для прохождения нужно набрать минимум ${MODULE_1.test.passingScore}%.`,
        duration: 5000,
      });
    }
  };

  // Retry test
  const retryTest = () => {
    setTestAnswers({});
    setTestSubmitted(false);
    setTestResults(null);
  };

  // Submit practice
  const submitPractice = async () => {
    if (practiceText.trim().length < 100) {
      toast({
        title: "Слишком короткий ответ",
        description: "Пожалуйста, напишите более развёрнутый ответ (минимум 100 символов).",
        duration: 4000,
      });
      return;
    }

    setIsPracticeSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newProgress = {
      ...progress,
      practiceSubmitted: true,
      practiceData: practiceText
    };
    saveProgress(newProgress);
    setIsPracticeSubmitting(false);
    
    toast({
      title: "✨ Практическое задание отправлено!",
      description: "Ваша работа сохранена. Вы можете перейти к завершению модуля.",
      duration: 5000,
    });
    
    setCurrentStep('complete');
    window.scrollTo(0, 0);
  };

  // Check if can proceed to test
  const canTakeTest = progress.lessonsCompleted.length === MODULE_1.lessons.length;
  
  // Check if can proceed to practice
  const canDoPractice = testResults?.passed || false;
  
  // Check if module is complete
  const isModuleComplete = progress.lessonsCompleted.length === MODULE_1.lessons.length && 
    (progress.testScore !== null && progress.testScore >= MODULE_1.test.passingScore) && 
    progress.practiceSubmitted;

  // Render overview
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero section */}
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-neon-turquoise/20 text-neon-turquoise border-neon-turquoise">
          Неделя 1 • Модуль 1
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {MODULE_1.title}
        </h1>
        <p className="text-cream max-w-2xl mx-auto mb-6">
          {MODULE_1.description}
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-cream">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-turquoise" />
            <span>{MODULE_1.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-neon-purple" />
            <span>{MODULE_1.lessons.length} урока</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-neon-amber" />
            <span>1 тест</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <Card className="glass-effect border-neon-turquoise/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cream">Прогресс модуля</span>
            <span className="text-neon-turquoise font-bold">{calculateProgress()}%</span>
          </div>
          <Progress value={calculateProgress()} className="h-3" />
        </CardContent>
      </Card>

      {/* Learning goals */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-neon-purple flex items-center gap-2">
            <Award className="w-5 h-5" />
            Цели модуля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MODULE_1.goals.map((goal, index) => (
              <li key={index} className="flex items-start gap-3 text-cream">
                <div className="w-6 h-6 bg-neon-turquoise/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-neon-turquoise font-bold">{index + 1}</span>
                </div>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Content outline */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <CardTitle className="text-xl text-neon-amber flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Содержание модуля
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lessons */}
          {MODULE_1.lessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                progress.lessonsCompleted.includes(lesson.id) 
                  ? 'bg-green-500/10 border border-green-500/30' 
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  progress.lessonsCompleted.includes(lesson.id)
                    ? 'bg-green-500/20'
                    : 'bg-neon-turquoise/20'
                }`}>
                  {progress.lessonsCompleted.includes(lesson.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <span className="text-neon-turquoise font-bold">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">Урок {index + 1}: {lesson.title}</p>
                  <p className="text-sm text-cream/70">Теоретический материал</p>
                </div>
              </div>
              <Badge variant={progress.lessonsCompleted.includes(lesson.id) ? "default" : "outline"}>
                {progress.lessonsCompleted.includes(lesson.id) ? "Пройден" : "Не начат"}
              </Badge>
            </div>
          ))}
          
          {/* Test */}
          <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            testResults?.passed 
              ? 'bg-green-500/10 border border-green-500/30' 
              : canTakeTest 
                ? 'bg-neon-amber/10 border border-neon-amber/30' 
                : 'bg-white/5 border border-white/10 opacity-50'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                testResults?.passed
                  ? 'bg-green-500/20'
                  : 'bg-neon-amber/20'
              }`}>
                {testResults?.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <FileText className="w-5 h-5 text-neon-amber" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">Тест</p>
                <p className="text-sm text-cream/70">
                  {testResults 
                    ? `Результат: ${progress.testScore}%` 
                    : `${MODULE_1.test.questions.length} вопросов, проходной балл ${MODULE_1.test.passingScore}%`}
                </p>
              </div>
            </div>
            <Badge variant={testResults?.passed ? "default" : canTakeTest ? "outline" : "secondary"}>
              {testResults?.passed ? "Пройден" : canTakeTest ? "Доступен" : "Заблокирован"}
            </Badge>
          </div>
          
          {/* Practice */}
          <div className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
            progress.practiceSubmitted 
              ? 'bg-green-500/10 border border-green-500/30' 
              : canDoPractice 
                ? 'bg-neon-purple/10 border border-neon-purple/30' 
                : 'bg-white/5 border border-white/10 opacity-50'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                progress.practiceSubmitted
                  ? 'bg-green-500/20'
                  : 'bg-neon-purple/20'
              }`}>
                {progress.practiceSubmitted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <GraduationCap className="w-5 h-5 text-neon-purple" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">Практическое задание</p>
                <p className="text-sm text-cream/70">{MODULE_1.practice.title}</p>
              </div>
            </div>
            <Badge variant={progress.practiceSubmitted ? "default" : canDoPractice ? "outline" : "secondary"}>
              {progress.practiceSubmitted ? "Выполнено" : canDoPractice ? "Доступно" : "Заблокировано"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Start button */}
      <div className="text-center">
        <Button 
          onClick={() => {
            setCurrentStep('lesson');
            window.scrollTo(0, 0);
          }}
          className="px-8 py-6 text-lg bg-gradient-to-r from-neon-turquoise to-electric text-night-blue font-semibold hover:scale-105 transition-all"
        >
          <Play className="mr-2 h-5 w-5" />
          {progress.lessonsCompleted.length > 0 ? 'Продолжить обучение' : 'Начать обучение'}
        </Button>
      </div>
    </div>
  );

  // Render lesson
  const renderLesson = () => {
    const lesson = MODULE_1.lessons[currentLessonIndex];
    
    return (
      <div className="space-y-6">
        {/* Lesson header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentStep('overview');
                window.scrollTo(0, 0);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              К обзору
            </Button>
            <Badge className="bg-neon-turquoise/20 text-neon-turquoise border-neon-turquoise">
              Урок {currentLessonIndex + 1} из {MODULE_1.lessons.length}
            </Badge>
          </div>
          <div className="text-sm text-cream">
            Прогресс: {progress.lessonsCompleted.length}/{MODULE_1.lessons.length} уроков
          </div>
        </div>

        {/* Progress bar */}
        <Progress 
          value={((currentLessonIndex + 1) / MODULE_1.lessons.length) * 100} 
          className="h-2"
        />

        {/* Lesson content */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-neon-turquoise">
              {lesson.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert prose-lg max-w-none">
              {renderContent(lesson.content)}
            </div>

            {/* Additional resources */}
            {lesson.additionalResources && lesson.additionalResources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-lg font-semibold text-neon-purple mb-4">Дополнительные материалы</h4>
                <div className="space-y-2">
                  {lesson.additionalResources.map((resource, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-cream p-3 bg-white/5 rounded-lg">
                      <Badge variant="outline" className="text-xs">
                        {resource.type === 'book' ? '📚 Книга' : resource.type === 'video' ? '🎥 Видео' : '📄 Статья'}
                      </Badge>
                      <span>{resource.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={prevLesson}
            disabled={currentLessonIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Предыдущий урок
          </Button>
          
          <Button
            onClick={nextLesson}
            className="bg-gradient-to-r from-neon-turquoise to-electric text-night-blue"
          >
            {currentLessonIndex === MODULE_1.lessons.length - 1 ? (
              <>
                Перейти к тесту
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Следующий урок
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Render test
  const renderTest = () => (
    <div className="space-y-6">
      {/* Test header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentStep('overview');
            window.scrollTo(0, 0);
          }}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          К обзору
        </Button>
        <Badge className="bg-neon-amber/20 text-neon-amber border-neon-amber">
          {MODULE_1.test.title}
        </Badge>
      </div>

      <Card className="glass-effect border-neon-amber/30">
        <CardHeader>
          <CardTitle className="text-2xl text-neon-amber flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {MODULE_1.test.title}
          </CardTitle>
          <p className="text-cream mt-2">
            Ответьте на {MODULE_1.test.questions.length} вопросов. 
            Для прохождения необходимо набрать минимум {MODULE_1.test.passingScore}%.
          </p>
          {progress.testAttempts > 0 && (
            <Badge variant="outline" className="mt-2">
              Попыток: {progress.testAttempts}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Questions */}
          {MODULE_1.test.questions.map((question, qIndex) => (
            <div key={question.id} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  testSubmitted
                    ? testAnswers[question.id] === question.correctAnswer
                      ? 'bg-green-500/20'
                      : 'bg-red-500/20'
                    : 'bg-neon-amber/20'
                }`}>
                  {testSubmitted ? (
                    testAnswers[question.id] === question.correctAnswer ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )
                  ) : (
                    <span className="text-neon-amber font-bold text-sm">{qIndex + 1}</span>
                  )}
                </div>
                <p className="text-white font-medium">{question.question}</p>
              </div>

              <RadioGroup
                value={testAnswers[question.id] || ''}
                onValueChange={(value) => {
                  if (!testSubmitted) {
                    setTestAnswers({ ...testAnswers, [question.id]: value });
                  }
                }}
                disabled={testSubmitted}
                className="pl-12 space-y-3"
              >
                {question.options.map((option) => (
                  <div 
                    key={option.id} 
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      testSubmitted
                        ? option.id === question.correctAnswer
                          ? 'bg-green-500/10 border border-green-500/30'
                          : testAnswers[question.id] === option.id
                            ? 'bg-red-500/10 border border-red-500/30'
                            : 'bg-white/5'
                        : testAnswers[question.id] === option.id
                          ? 'bg-neon-amber/10 border border-neon-amber/30'
                          : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <RadioGroupItem value={option.id} id={`q${question.id}-${option.id}`} />
                    <Label 
                      htmlFor={`q${question.id}-${option.id}`} 
                      className="text-cream cursor-pointer flex-1"
                    >
                      {option.text}
                    </Label>
                    {testSubmitted && option.id === question.correctAnswer && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </RadioGroup>

              {/* Show explanation after submission */}
              {testSubmitted && testAnswers[question.id] !== question.correctAnswer && (
                <div className="ml-12 p-4 bg-neon-amber/10 border border-neon-amber/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-neon-amber flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-neon-amber font-medium text-sm">Объяснение:</p>
                      <p className="text-cream text-sm">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Test results */}
          {testResults && (
            <Card className={`${testResults.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  {testResults.passed ? (
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500" />
                  )}
                  <div>
                    <p className={`text-xl font-bold ${testResults.passed ? 'text-green-500' : 'text-red-500'}`}>
                      {testResults.passed ? 'Тест пройден!' : 'Тест не пройден'}
                    </p>
                    <p className="text-cream">
                      Правильных ответов: {testResults.correct} из {testResults.total} ({progress.testScore}%)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex justify-center gap-4 pt-4">
            {!testSubmitted ? (
              <Button
                onClick={submitTest}
                disabled={Object.keys(testAnswers).length !== MODULE_1.test.questions.length}
                className="px-8 py-3 bg-gradient-to-r from-neon-amber to-yellow-500 text-night-blue font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                Отправить ответы
              </Button>
            ) : testResults && !testResults.passed ? (
              <Button
                onClick={retryTest}
                variant="outline"
                className="px-8 py-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Попробовать снова
              </Button>
            ) : testResults?.passed ? (
              <Button
                onClick={() => {
                  setCurrentStep('practice');
                  window.scrollTo(0, 0);
                }}
                className="px-8 py-3 bg-gradient-to-r from-neon-purple to-purple-500 text-white font-semibold"
              >
                Перейти к практике
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render practice
  const renderPractice = () => (
    <div className="space-y-6">
      {/* Practice header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCurrentStep('overview');
            window.scrollTo(0, 0);
          }}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          К обзору
        </Button>
        <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple">
          Практическое задание
        </Badge>
      </div>

      <Card className="glass-effect border-neon-purple/30">
        <CardHeader>
          <CardTitle className="text-2xl text-neon-purple flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            {MODULE_1.practice.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-cream leading-relaxed">{MODULE_1.practice.description}</p>
          
          {/* Requirements */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-neon-turquoise">Требования к заданию:</h4>
            <ul className="space-y-2">
              {MODULE_1.practice.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-cream">
                  <div className="w-6 h-6 bg-neon-purple/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-neon-purple font-bold">{index + 1}</span>
                  </div>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Text input */}
          <div className="space-y-3">
            <Label htmlFor="practice" className="text-neon-amber">Ваш ответ:</Label>
            <Textarea
              id="practice"
              value={practiceText}
              onChange={(e) => setPracticeText(e.target.value)}
              placeholder="Опишите ваше мини-меню из трёх коктейлей..."
              className="min-h-[300px] bg-white/5 border-white/20 text-white placeholder:text-white/40"
              disabled={progress.practiceSubmitted}
            />
            <p className="text-sm text-cream/70">
              Минимум 100 символов. Введено: {practiceText.length}
            </p>
          </div>

          {progress.practiceSubmitted ? (
            <Card className="bg-green-500/10 border-green-500/30">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <div>
                    <p className="text-xl font-bold text-green-500">Задание выполнено!</p>
                    <p className="text-cream">Ваша работа успешно сохранена.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              onClick={submitPractice}
              disabled={isPracticeSubmitting || practiceText.length < 100}
              className="w-full py-6 bg-gradient-to-r from-neon-purple to-purple-500 text-white font-semibold"
            >
              {isPracticeSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Отправка...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Отправить задание
                </>
              )}
            </Button>
          )}

          {progress.practiceSubmitted && (
            <Button
              onClick={() => {
                setCurrentStep('complete');
                window.scrollTo(0, 0);
              }}
              className="w-full py-6 bg-gradient-to-r from-neon-turquoise to-electric text-night-blue font-semibold"
            >
              Завершить модуль
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Render completion
  const renderComplete = () => (
    <div className="text-center space-y-8 py-12">
      <div className="relative inline-block">
        <div className="w-32 h-32 bg-gradient-to-br from-neon-turquoise to-neon-purple rounded-full flex items-center justify-center mx-auto animate-pulse">
          <Award className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          🎉 Поздравляем!
        </h1>
        <p className="text-xl text-neon-turquoise mb-2">
          Модуль 1 успешно завершён!
        </p>
        <p className="text-cream max-w-lg mx-auto">
          Вы освоили основы миксологии и барной культуры. Теперь вы знаете историю коктейлей, 
          классификацию напитков и роль бармена в гостеприимстве.
        </p>
      </div>

      {/* Results summary */}
      <Card className="glass-effect border-neon-turquoise/30 max-w-md mx-auto">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neon-amber">Ваши результаты:</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-cream">Уроки пройдены:</span>
              <span className="text-neon-turquoise font-bold">{MODULE_1.lessons.length}/{MODULE_1.lessons.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream">Результат теста:</span>
              <span className="text-neon-turquoise font-bold">{progress.testScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cream">Практика:</span>
              <span className="text-green-500 font-bold">Выполнена</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning outcomes */}
      <Card className="glass-effect border-white/10 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-neon-purple">Вы теперь умеете:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-left">
            {MODULE_1.outcomes.map((outcome, index) => (
              <li key={index} className="flex items-start gap-3 text-cream">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
        <Button
          variant="outline"
          onClick={() => setLocation('/courses/mixology-basics')}
          className="px-8 py-3"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Вернуться к курсу
        </Button>
        <Button
          onClick={() => {
            toast({
              title: "Скоро!",
              description: "Модуль 2 будет доступен после добавления контента.",
              duration: 3000,
            });
          }}
          className="px-8 py-3 bg-gradient-to-r from-neon-turquoise to-electric text-night-blue"
        >
          Перейти к модулю 2
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-night-blue text-ice-white">
      <Header />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {currentStep === 'overview' && renderOverview()}
          {currentStep === 'lesson' && renderLesson()}
          {currentStep === 'test' && renderTest()}
          {currentStep === 'practice' && renderPractice()}
          {currentStep === 'complete' && renderComplete()}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
