import React, { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Atom,
  Trophy,
  Timer,
  Zap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Brain,
  Target,
  Flame,
  Star,
} from 'lucide-react';

interface ElementData {
  symbol: string;
  name: string;
  nameAm: string;
  atomicNumber: number;
  category: string;
  molarMass: number;
}

const ELEMENTS: ElementData[] = [
  { symbol: 'H', name: 'Hydrogen', nameAm: 'ሃይድሮጂን', atomicNumber: 1, category: 'Nonmetal', molarMass: 1.008 },
  { symbol: 'He', name: 'Helium', nameAm: 'ሂሊየም', atomicNumber: 2, category: 'Noble Gas', molarMass: 4.003 },
  { symbol: 'Li', name: 'Lithium', nameAm: 'ሊቲየም', atomicNumber: 3, category: 'Alkali Metal', molarMass: 6.941 },
  { symbol: 'C', name: 'Carbon', nameAm: 'ካርቦን', atomicNumber: 6, category: 'Nonmetal', molarMass: 12.011 },
  { symbol: 'N', name: 'Nitrogen', nameAm: 'ናይትሮጂን', atomicNumber: 7, category: 'Nonmetal', molarMass: 14.007 },
  { symbol: 'O', name: 'Oxygen', nameAm: 'ኦክስጂን', atomicNumber: 8, category: 'Nonmetal', molarMass: 15.999 },
  { symbol: 'F', name: 'Fluorine', nameAm: 'ፍሎሪን', atomicNumber: 9, category: 'Halogen', molarMass: 18.998 },
  { symbol: 'Ne', name: 'Neon', nameAm: 'ኒዮን', atomicNumber: 10, category: 'Noble Gas', molarMass: 20.180 },
  { symbol: 'Na', name: 'Sodium', nameAm: 'ሶዲየም', atomicNumber: 11, category: 'Alkali Metal', molarMass: 22.990 },
  { symbol: 'Mg', name: 'Magnesium', nameAm: 'ማግኒዝየም', atomicNumber: 12, category: 'Alkaline Earth', molarMass: 24.305 },
  { symbol: 'Al', name: 'Aluminum', nameAm: 'አልሙኒየም', atomicNumber: 13, category: 'Metal', molarMass: 26.982 },
  { symbol: 'Si', name: 'Silicon', nameAm: 'ሲሊኮን', atomicNumber: 14, category: 'Metalloid', molarMass: 28.086 },
  { symbol: 'P', name: 'Phosphorus', nameAm: 'ፎስፎረስ', atomicNumber: 15, category: 'Nonmetal', molarMass: 30.974 },
  { symbol: 'S', name: 'Sulfur', nameAm: 'ሰልፈር', atomicNumber: 16, category: 'Nonmetal', molarMass: 32.065 },
  { symbol: 'Cl', name: 'Chlorine', nameAm: 'ክሎሪን', atomicNumber: 17, category: 'Halogen', molarMass: 35.453 },
  { symbol: 'K', name: 'Potassium', nameAm: 'ፖታሲየም', atomicNumber: 19, category: 'Alkali Metal', molarMass: 39.098 },
  { symbol: 'Ca', name: 'Calcium', nameAm: 'ካልሲየም', atomicNumber: 20, category: 'Alkaline Earth', molarMass: 40.078 },
  { symbol: 'Fe', name: 'Iron', nameAm: 'ብረት', atomicNumber: 26, category: 'Transition Metal', molarMass: 55.845 },
  { symbol: 'Cu', name: 'Copper', nameAm: 'መዳብ', atomicNumber: 29, category: 'Transition Metal', molarMass: 63.546 },
  { symbol: 'Zn', name: 'Zinc', nameAm: 'ዚንክ', atomicNumber: 30, category: 'Transition Metal', molarMass: 65.380 },
  { symbol: 'Br', name: 'Bromine', nameAm: 'ብሮሚን', atomicNumber: 35, category: 'Halogen', molarMass: 79.904 },
  { symbol: 'Ag', name: 'Silver', nameAm: 'ብር', atomicNumber: 47, category: 'Transition Metal', molarMass: 107.868 },
  { symbol: 'I', name: 'Iodine', nameAm: 'አዮዲን', atomicNumber: 53, category: 'Halogen', molarMass: 126.904 },
  { symbol: 'Au', name: 'Gold', nameAm: 'ወርቅ', atomicNumber: 79, category: 'Transition Metal', molarMass: 196.967 },
  { symbol: 'Hg', name: 'Mercury', nameAm: 'ሜርኩሪ', atomicNumber: 80, category: 'Transition Metal', molarMass: 200.592 },
  { symbol: 'Pb', name: 'Lead', nameAm: 'እርሳስ', atomicNumber: 82, category: 'Metal', molarMass: 207.200 },
  { symbol: 'U', name: 'Uranium', nameAm: 'ዩራኒየም', atomicNumber: 92, category: 'Actinide', molarMass: 238.029 },
  { symbol: 'Pt', name: 'Platinum', nameAm: 'ፕላቲኒየም', atomicNumber: 78, category: 'Transition Metal', molarMass: 195.084 },
];

type QuizMode = 'symbol-to-name' | 'name-to-symbol' | 'atomic-number' | 'mixed';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizQuestion {
  question: string;
  questionAm: string;
  correct: string;
  options: string[];
  element: ElementData;
}

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const ElementQuizPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';
  const getText = (en: string, am: string) => isAm ? am : en;

  const [mode, setMode] = useState<QuizMode>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const totalQ = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
  const timePerQ = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 10 : 7;

  const generateQuestions = useCallback((): QuizQuestion[] => {
    const pool = shuffle(ELEMENTS).slice(0, totalQ);
    return pool.map(el => {
      const questionTypes: QuizMode[] = mode === 'mixed' ? shuffle(['symbol-to-name', 'name-to-symbol', 'atomic-number']) : [mode];
      const type = questionTypes[0];

      let question = '', questionAm = '', correct = '';
      const others = shuffle(ELEMENTS.filter(e => e.symbol !== el.symbol));

      switch (type) {
        case 'symbol-to-name':
          question = `What element has the symbol "${el.symbol}"?`;
          questionAm = `"${el.symbol}" ምልክት ያለው ንጥረ ነገር ምንድነው?`;
          correct = el.name;
          return { question, questionAm, correct, options: shuffle([el.name, ...others.slice(0, 3).map(o => o.name)]), element: el };
        case 'name-to-symbol':
          question = `What is the symbol for ${el.name}?`;
          questionAm = `${el.nameAm} ምልክቱ ምንድነው?`;
          correct = el.symbol;
          return { question, questionAm, correct, options: shuffle([el.symbol, ...others.slice(0, 3).map(o => o.symbol)]), element: el };
        case 'atomic-number':
          question = `What is the atomic number of ${el.name} (${el.symbol})?`;
          questionAm = `${el.nameAm} (${el.symbol}) አቶሚክ ቁጥሩ ስንት ነው?`;
          correct = String(el.atomicNumber);
          return { question, questionAm, correct, options: shuffle([String(el.atomicNumber), ...others.slice(0, 3).map(o => String(o.atomicNumber))]), element: el };
        default:
          return { question: '', questionAm: '', correct: '', options: [], element: el };
      }
    });
  }, [mode, totalQ]);

  const startGame = () => {
    const qs = generateQuestions();
    setQuestions(qs);
    setCurrentQ(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setAnswered(null);
    setGameOver(false);
    setGameStarted(true);
    setTimeLeft(timePerQ);
  };

  useEffect(() => {
    if (!gameStarted || gameOver || answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setAnswered('__timeout__');
          setStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameOver, answered, currentQ]);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    clearInterval(timerRef.current);
    setAnswered(answer);
    const isCorrect = answer === questions[currentQ].correct;
    if (isCorrect) {
      const bonus = timeLeft > timePerQ / 2 ? 2 : 1;
      setScore(s => s + (10 * bonus));
      setStreak(s => {
        const newS = s + 1;
        setBestStreak(b => Math.max(b, newS));
        return newS;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setGameOver(true);
    } else {
      setCurrentQ(q => q + 1);
      setAnswered(null);
      setTimeLeft(timePerQ);
    }
  };

  const q = questions[currentQ];
  const progress = questions.length > 0 ? ((currentQ + (answered ? 1 : 0)) / questions.length) * 100 : 0;

  const modeOptions: { value: QuizMode; label: string; labelAm: string; icon: React.ReactNode }[] = [
    { value: 'symbol-to-name', label: 'Symbol → Name', labelAm: 'ምልክት → ስም', icon: <Atom className="w-4 h-4" /> },
    { value: 'name-to-symbol', label: 'Name → Symbol', labelAm: 'ስም → ምልክት', icon: <Target className="w-4 h-4" /> },
    { value: 'atomic-number', label: 'Atomic Number', labelAm: 'አቶሚክ ቁጥር', icon: <Zap className="w-4 h-4" /> },
    { value: 'mixed', label: 'Mixed Mode', labelAm: 'ቅልቅል', icon: <Brain className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-primary to-accent flex items-center justify-center animate-float">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold gradient-text">
              {getText('Element Quiz', 'የንጥረ ነገር ጥያቄ')}
            </h1>
            <p className="text-muted-foreground">
              {getText('Test your periodic table knowledge', 'የፔሪዮዲክ ሠንጠረዥ እውቀትዎን ይፈትሹ')}
            </p>
          </div>
        </div>

        {!gameStarted ? (
          /* Setup Screen */
          <div className="space-y-6">
            {/* Mode Selection */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">{getText('Quiz Mode', 'የጥያቄ ሁነታ')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {modeOptions.map(opt => (
                  <Button
                    key={opt.value}
                    variant={mode === opt.value ? 'default' : 'outline'}
                    className="gap-2 h-auto py-3 flex-col"
                    onClick={() => setMode(opt.value)}
                  >
                    {opt.icon}
                    <span className="text-xs">{isAm ? opt.labelAm : opt.label}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Difficulty */}
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">{getText('Difficulty', 'ደረጃ')}</h3>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => (
                  <Button
                    key={d}
                    variant={difficulty === d ? 'default' : 'outline'}
                    onClick={() => setDifficulty(d)}
                    className="gap-2"
                  >
                    {d === 'easy' && <Star className="w-4 h-4" />}
                    {d === 'medium' && <><Star className="w-4 h-4" /><Star className="w-4 h-4" /></>}
                    {d === 'hard' && <Flame className="w-4 h-4" />}
                    <span className="capitalize">{d}</span>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {difficulty === 'easy' && getText('10 questions · 15s each', '10 ጥያቄዎች · 15 ሰከንድ')}
                {difficulty === 'medium' && getText('15 questions · 10s each', '15 ጥያቄዎች · 10 ሰከንድ')}
                {difficulty === 'hard' && getText('20 questions · 7s each', '20 ጥያቄዎች · 7 ሰከንድ')}
              </p>
            </Card>

            <Button size="lg" className="w-full gap-2 text-lg h-14" onClick={startGame}>
              <Zap className="w-6 h-6" />
              {getText('Start Quiz', 'ጥያቄ ጀምር')}
            </Button>
          </div>
        ) : gameOver ? (
          /* Results Screen */
          <Card className="p-8 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-primary mx-auto flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold">{getText('Quiz Complete!', 'ጥያቄ ተጠናቀቀ!')}</h2>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <Card className="p-4">
                <p className="text-3xl font-bold text-primary">{score}</p>
                <p className="text-xs text-muted-foreground">{getText('Points', 'ነጥቦች')}</p>
              </Card>
              <Card className="p-4">
                <p className="text-3xl font-bold text-green-500">{Math.round((score / (totalQ * 20)) * 100)}%</p>
                <p className="text-xs text-muted-foreground">{getText('Accuracy', 'ትክክለኛነት')}</p>
              </Card>
              <Card className="p-4">
                <p className="text-3xl font-bold text-amber-500">{bestStreak}</p>
                <p className="text-xs text-muted-foreground">{getText('Best Streak', 'ምርጥ ተከታታይ')}</p>
              </Card>
            </div>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={startGame} className="gap-2">
                <RotateCcw className="w-5 h-5" />
                {getText('Play Again', 'እንደገና ተጫወት')}
              </Button>
              <Button size="lg" variant="outline" onClick={() => setGameStarted(false)}>
                {getText('Change Settings', 'ቅንብር ቀይር')}
              </Button>
            </div>
          </Card>
        ) : q ? (
          /* Question Screen */
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="gap-1 text-base px-3 py-1">
                  <Trophy className="w-4 h-4 text-amber-500" /> {score}
                </Badge>
                {streak > 1 && (
                  <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-red-500 text-white animate-pulse">
                    <Flame className="w-4 h-4" /> {streak}x {getText('Streak!', 'ተከታታይ!')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Timer className={`w-5 h-5 ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                <span className={`font-mono text-lg font-bold ${timeLeft <= 3 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
              </div>
            </div>

            <Progress value={progress} className="h-2" />

            <Card className="p-8">
              <p className="text-sm text-muted-foreground mb-2">
                {getText(`Question ${currentQ + 1} of ${questions.length}`, `ጥያቄ ${currentQ + 1} ከ ${questions.length}`)}
              </p>

              {/* Element Preview */}
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex flex-col items-center justify-center border-2 border-primary/30">
                  <span className="text-3xl font-bold text-primary">{q.element.symbol}</span>
                  <span className="text-[10px] text-muted-foreground">{q.element.atomicNumber}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-center mb-8">{isAm ? q.questionAm : q.question}</h2>

              <div className="grid grid-cols-2 gap-4">
                {q.options.map((opt, i) => {
                  const isCorrect = opt === q.correct;
                  const isSelected = opt === answered;
                  const isTimeout = answered === '__timeout__';
                  let variant: 'outline' | 'default' | 'destructive' = 'outline';
                  let extraClass = 'hover:bg-primary/10 hover:border-primary/50';

                  if (answered || isTimeout) {
                    extraClass = '';
                    if (isCorrect) variant = 'default';
                    else if (isSelected) variant = 'destructive';
                  }

                  return (
                    <Button
                      key={i}
                      variant={variant}
                      className={`h-auto py-4 text-lg justify-start gap-3 ${extraClass}`}
                      onClick={() => handleAnswer(opt)}
                      disabled={!!answered}
                    >
                      <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                      {answered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                      {answered && isSelected && !isCorrect && <XCircle className="w-5 h-5 ml-auto" />}
                    </Button>
                  );
                })}
              </div>

              {(answered || answered === '__timeout__') && (
                <div className="mt-6 text-center">
                  {answered === '__timeout__' && (
                    <p className="text-red-500 font-semibold mb-2">{getText('Time\'s up!', 'ጊዜ አልቋል!')}</p>
                  )}
                  <Button size="lg" onClick={nextQuestion} className="gap-2">
                    {currentQ + 1 >= questions.length ? getText('See Results', 'ውጤት ይመልከቱ') : getText('Next Question', 'ቀጣይ ጥያቄ')}
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default ElementQuizPage;
