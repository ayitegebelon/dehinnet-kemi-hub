import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gamepad2, Trophy, Timer, CheckCircle, XCircle, Zap, Atom, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

// Element matching game data
const ELEMENTS = [
  { symbol: 'H', name: 'Hydrogen', nameAm: 'ሃይድሮጅን', number: 1 },
  { symbol: 'He', name: 'Helium', nameAm: 'ሂሊየም', number: 2 },
  { symbol: 'Li', name: 'Lithium', nameAm: 'ሊቲየም', number: 3 },
  { symbol: 'Be', name: 'Beryllium', nameAm: 'ቤሪሊየም', number: 4 },
  { symbol: 'B', name: 'Boron', nameAm: 'ቦሮን', number: 5 },
  { symbol: 'C', name: 'Carbon', nameAm: 'ካርቦን', number: 6 },
  { symbol: 'N', name: 'Nitrogen', nameAm: 'ናይትሮጅን', number: 7 },
  { symbol: 'O', name: 'Oxygen', nameAm: 'ኦክስጅን', number: 8 },
  { symbol: 'F', name: 'Fluorine', nameAm: 'ፍሎሪን', number: 9 },
  { symbol: 'Ne', name: 'Neon', nameAm: 'ኒዮን', number: 10 },
  { symbol: 'Na', name: 'Sodium', nameAm: 'ሶዲየም', number: 11 },
  { symbol: 'Mg', name: 'Magnesium', nameAm: 'ማግኒዚየም', number: 12 },
  { symbol: 'Al', name: 'Aluminum', nameAm: 'አሉሚኒየም', number: 13 },
  { symbol: 'Si', name: 'Silicon', nameAm: 'ሲሊኮን', number: 14 },
  { symbol: 'P', name: 'Phosphorus', nameAm: 'ፎስፈረስ', number: 15 },
  { symbol: 'S', name: 'Sulfur', nameAm: 'ሰልፈር', number: 16 },
  { symbol: 'Cl', name: 'Chlorine', nameAm: 'ክሎሪን', number: 17 },
  { symbol: 'Ar', name: 'Argon', nameAm: 'አርጎን', number: 18 },
  { symbol: 'K', name: 'Potassium', nameAm: 'ፖታሲየም', number: 19 },
  { symbol: 'Ca', name: 'Calcium', nameAm: 'ካልሲየም', number: 20 },
  { symbol: 'Fe', name: 'Iron', nameAm: 'ብረት', number: 26 },
  { symbol: 'Cu', name: 'Copper', nameAm: 'መዳብ', number: 29 },
  { symbol: 'Zn', name: 'Zinc', nameAm: 'ዚንክ', number: 30 },
  { symbol: 'Ag', name: 'Silver', nameAm: 'ብር', number: 47 },
  { symbol: 'Au', name: 'Gold', nameAm: 'ወርቅ', number: 79 },
];

const EQUATIONS = [
  { reactants: '2H₂ + O₂', products: '2H₂O', name: 'Water Formation', nameAm: 'ውሃ መፈጠር' },
  { reactants: 'CH₄ + 2O₂', products: 'CO₂ + 2H₂O', name: 'Methane Combustion', nameAm: 'ሚቴን ማቃጠል' },
  { reactants: '2Na + Cl₂', products: '2NaCl', name: 'Salt Formation', nameAm: 'ጨው መፈጠር' },
  { reactants: 'N₂ + 3H₂', products: '2NH₃', name: 'Ammonia Synthesis', nameAm: 'አሞኒያ ምርት' },
  { reactants: 'CaCO₃', products: 'CaO + CO₂', name: 'Limestone Decomposition', nameAm: 'ኖራ መበስበስ' },
  { reactants: '2Fe + 3Cl₂', products: '2FeCl₃', name: 'Iron Chloride', nameAm: 'የብረት ክሎራይድ' },
  { reactants: 'Zn + H₂SO₄', products: 'ZnSO₄ + H₂', name: 'Zinc Reaction', nameAm: 'ዚንክ ምላሽ' },
  { reactants: '2KClO₃', products: '2KCl + 3O₂', name: 'Potassium Chlorate', nameAm: 'ፖታሲየም ክሎሬት' },
];

const ChemistryGamesPage: React.FC = () => {
  const { language } = useLanguage();
  const isAm = language === 'am';

  // Element Quiz State
  const [quizElements, setQuizElements] = useState<typeof ELEMENTS>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizScore, setQuizScore] = useState(0);
  const [quizTotal, setQuizTotal] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizTimer, setQuizTimer] = useState(30);
  const [quizActive, setQuizActive] = useState(false);

  // Equation Matching State
  const [eqQuestions, setEqQuestions] = useState<typeof EQUATIONS>([]);
  const [eqIndex, setEqIndex] = useState(0);
  const [eqOptions, setEqOptions] = useState<string[]>([]);
  const [eqScore, setEqScore] = useState(0);
  const [eqTotal, setEqTotal] = useState(0);
  const [eqFeedback, setEqFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Speed Round State
  const [speedElements, setSpeedElements] = useState<typeof ELEMENTS>([]);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedTimer, setSpeedTimer] = useState(60);
  const [speedActive, setSpeedActive] = useState(false);
  const [speedOptions, setSpeedOptions] = useState<string[]>([]);

  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  // Element Quiz
  const startQuiz = () => {
    const shuffled = shuffle(ELEMENTS).slice(0, 10);
    setQuizElements(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizTotal(0);
    setQuizAnswer('');
    setQuizFeedback(null);
    setQuizTimer(30);
    setQuizActive(true);
  };

  useEffect(() => {
    if (!quizActive || quizTimer <= 0) return;
    const t = setTimeout(() => setQuizTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [quizTimer, quizActive]);

  useEffect(() => {
    if (quizActive && quizTimer === 0) {
      setQuizFeedback('wrong');
      setTimeout(() => nextQuizQuestion(), 1000);
    }
  }, [quizTimer, quizActive]);

  const checkQuizAnswer = () => {
    if (!quizElements[quizIndex]) return;
    const correct = quizElements[quizIndex].name.toLowerCase();
    if (quizAnswer.trim().toLowerCase() === correct) {
      setQuizScore(s => s + 1);
      setQuizFeedback('correct');
    } else {
      setQuizFeedback('wrong');
    }
    setQuizTotal(t => t + 1);
    setTimeout(() => nextQuizQuestion(), 1200);
  };

  const nextQuizQuestion = () => {
    if (quizIndex + 1 >= quizElements.length) {
      setQuizActive(false);
      toast.success(`${isAm ? 'ውጤት' : 'Final Score'}: ${quizScore}/${quizTotal + (quizFeedback ? 0 : 1)}`);
      return;
    }
    setQuizIndex(i => i + 1);
    setQuizAnswer('');
    setQuizFeedback(null);
    setQuizTimer(30);
  };

  // Equation Matching
  const startEquations = () => {
    const shuffled = shuffle(EQUATIONS);
    setEqQuestions(shuffled);
    setEqIndex(0);
    setEqScore(0);
    setEqTotal(0);
    setEqFeedback(null);
    generateEqOptions(shuffled, 0);
  };

  const generateEqOptions = (questions: typeof EQUATIONS, idx: number) => {
    const correct = questions[idx].products;
    const others = shuffle(EQUATIONS.filter(e => e.products !== correct)).slice(0, 3).map(e => e.products);
    setEqOptions(shuffle([correct, ...others]));
  };

  const checkEquation = (answer: string) => {
    if (!eqQuestions[eqIndex]) return;
    if (answer === eqQuestions[eqIndex].products) {
      setEqScore(s => s + 1);
      setEqFeedback('correct');
    } else {
      setEqFeedback('wrong');
    }
    setEqTotal(t => t + 1);
    setTimeout(() => {
      if (eqIndex + 1 >= eqQuestions.length) {
        toast.success(`${isAm ? 'ውጤት' : 'Score'}: ${eqScore + (answer === eqQuestions[eqIndex].products ? 1 : 0)}/${eqTotal + 1}`);
        setEqIndex(0);
        return;
      }
      setEqIndex(i => i + 1);
      setEqFeedback(null);
      generateEqOptions(eqQuestions, eqIndex + 1);
    }, 1000);
  };

  // Speed Round
  const startSpeedRound = () => {
    const shuffled = shuffle(ELEMENTS);
    setSpeedElements(shuffled);
    setSpeedIndex(0);
    setSpeedScore(0);
    setSpeedTimer(60);
    setSpeedActive(true);
    generateSpeedOptions(shuffled, 0);
  };

  const generateSpeedOptions = (elems: typeof ELEMENTS, idx: number) => {
    const correct = elems[idx].symbol;
    const others = shuffle(ELEMENTS.filter(e => e.symbol !== correct)).slice(0, 3).map(e => e.symbol);
    setSpeedOptions(shuffle([correct, ...others]));
  };

  useEffect(() => {
    if (!speedActive || speedTimer <= 0) return;
    const t = setTimeout(() => setSpeedTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [speedTimer, speedActive]);

  useEffect(() => {
    if (speedActive && speedTimer === 0) {
      setSpeedActive(false);
      toast.success(`${isAm ? 'ውጤት' : 'Speed Score'}: ${speedScore}`);
    }
  }, [speedTimer, speedActive]);

  const checkSpeedAnswer = (answer: string) => {
    if (!speedElements[speedIndex]) return;
    if (answer === speedElements[speedIndex].symbol) {
      setSpeedScore(s => s + 1);
    }
    if (speedIndex + 1 >= speedElements.length) {
      setSpeedActive(false);
      toast.success(`${isAm ? 'ውጤት' : 'Speed Score'}: ${speedScore + (answer === speedElements[speedIndex].symbol ? 1 : 0)}`);
      return;
    }
    setSpeedIndex(i => i + 1);
    generateSpeedOptions(speedElements, speedIndex + 1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isAm ? 'የኬሚስትሪ ጨዋታዎች' : 'Chemistry Games'}</h1>
            <p className="text-muted-foreground text-sm">{isAm ? 'በጨዋታ ኬሚስትሪ ይማሩ' : 'Learn chemistry through games'}</p>
          </div>
        </div>

        <Tabs defaultValue="quiz">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="quiz"><Atom className="h-4 w-4 mr-1" />{isAm ? 'ንጥረ ነገር' : 'Elements'}</TabsTrigger>
            <TabsTrigger value="equations"><Zap className="h-4 w-4 mr-1" />{isAm ? 'ቀመሮች' : 'Equations'}</TabsTrigger>
            <TabsTrigger value="speed"><Timer className="h-4 w-4 mr-1" />{isAm ? 'ፍጥነት' : 'Speed'}</TabsTrigger>
          </TabsList>

          {/* Element Quiz */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isAm ? 'የንጥረ ነገር ስም ጨዋታ' : 'Name the Element'}</span>
                  {quizActive && <Badge variant="secondary"><Timer className="h-3 w-3 mr-1" />{quizTimer}s</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!quizActive ? (
                  <div className="text-center py-8 space-y-4">
                    {quizTotal > 0 && (
                      <div className="mb-4">
                        <p className="text-2xl font-bold">{quizScore}/{quizTotal}</p>
                        <p className="text-muted-foreground text-sm">{isAm ? 'የመጨረሻ ውጤት' : 'Last Score'}</p>
                      </div>
                    )}
                    <p className="text-muted-foreground">{isAm ? 'የንጥረ ነገር ምልክቱን አይተው ስሙን ይጻፉ' : 'See the element symbol, type its name'}</p>
                    <Button onClick={startQuiz} size="lg">
                      <Gamepad2 className="h-5 w-5 mr-2" />{isAm ? 'ጀምር' : 'Start Game'}
                    </Button>
                  </div>
                ) : quizElements[quizIndex] && (
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{quizIndex + 1}/{quizElements.length}</span>
                      <span>{isAm ? 'ውጤት' : 'Score'}: {quizScore}</span>
                    </div>
                    <div className={`w-28 h-28 mx-auto rounded-2xl flex flex-col items-center justify-center border-2 transition-colors ${
                      quizFeedback === 'correct' ? 'border-emerald-500 bg-emerald-500/10' :
                      quizFeedback === 'wrong' ? 'border-destructive bg-destructive/10' :
                      'border-primary/30 bg-primary/5'
                    }`}>
                      <span className="text-4xl font-bold">{quizElements[quizIndex].symbol}</span>
                      <span className="text-xs text-muted-foreground">#{quizElements[quizIndex].number}</span>
                    </div>
                    {quizFeedback && (
                      <div className="flex items-center justify-center gap-2">
                        {quizFeedback === 'correct' ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                        <span className={quizFeedback === 'correct' ? 'text-emerald-500' : 'text-destructive'}>
                          {quizFeedback === 'correct' ? (isAm ? 'ትክክል!' : 'Correct!') : `${isAm ? 'መልሱ' : 'Answer'}: ${quizElements[quizIndex].name}`}
                        </span>
                      </div>
                    )}
                    {!quizFeedback && (
                      <div className="flex gap-2 max-w-xs mx-auto">
                        <Input
                          value={quizAnswer}
                          onChange={e => setQuizAnswer(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') checkQuizAnswer(); }}
                          placeholder={isAm ? 'ስም ይጻፉ...' : 'Type element name...'}
                          autoFocus
                        />
                        <Button onClick={checkQuizAnswer}>{isAm ? 'ፈትሽ' : 'Check'}</Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equation Matching */}
          <TabsContent value="equations">
            <Card>
              <CardHeader>
                <CardTitle>{isAm ? 'የቀመር ማዛመድ' : 'Equation Matching'}</CardTitle>
              </CardHeader>
              <CardContent>
                {eqQuestions.length === 0 || eqIndex >= eqQuestions.length ? (
                  <div className="text-center py-8 space-y-4">
                    {eqTotal > 0 && (
                      <div className="mb-4">
                        <p className="text-2xl font-bold">{eqScore}/{eqTotal}</p>
                        <p className="text-muted-foreground text-sm">{isAm ? 'የመጨረሻ ውጤት' : 'Last Score'}</p>
                      </div>
                    )}
                    <p className="text-muted-foreground">{isAm ? 'ትክክለኛውን ውጤት ይምረጡ' : 'Match reactants with the correct products'}</p>
                    <Button onClick={startEquations} size="lg">
                      <Zap className="h-5 w-5 mr-2" />{isAm ? 'ጀምር' : 'Start'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{eqIndex + 1}/{eqQuestions.length}</span>
                      <span>{isAm ? 'ውጤት' : 'Score'}: {eqScore}</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">{isAm ? eqQuestions[eqIndex].nameAm : eqQuestions[eqIndex].name}</p>
                      <p className="text-2xl font-mono font-bold">{eqQuestions[eqIndex].reactants} → ?</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {eqOptions.map((opt, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className={`h-auto py-3 font-mono ${
                            eqFeedback && opt === eqQuestions[eqIndex].products ? 'border-emerald-500 bg-emerald-500/10' :
                            eqFeedback === 'wrong' ? 'opacity-50' : ''
                          }`}
                          onClick={() => !eqFeedback && checkEquation(opt)}
                          disabled={!!eqFeedback}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Speed Round */}
          <TabsContent value="speed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{isAm ? 'ፈጣን ዙር' : 'Speed Round'}</span>
                  {speedActive && (
                    <Badge variant={speedTimer <= 10 ? 'destructive' : 'secondary'}>
                      <Timer className="h-3 w-3 mr-1" />{speedTimer}s
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!speedActive ? (
                  <div className="text-center py-8 space-y-4">
                    {speedScore > 0 && (
                      <div className="mb-4">
                        <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold">{speedScore}</p>
                        <p className="text-muted-foreground text-sm">{isAm ? 'ውጤት' : 'Points'}</p>
                      </div>
                    )}
                    <p className="text-muted-foreground">{isAm ? '60 ሰከንድ ውስጥ ብዙ ንጥረ ነገሮችን ይለዩ' : 'Identify as many elements as possible in 60 seconds'}</p>
                    <Button onClick={startSpeedRound} size="lg">
                      <Timer className="h-5 w-5 mr-2" />{isAm ? 'ጀምር' : 'Start'}
                    </Button>
                  </div>
                ) : speedElements[speedIndex] && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{isAm ? 'ውጤት' : 'Score'}: {speedScore}</Badge>
                      <Badge>{speedIndex + 1}</Badge>
                    </div>
                    <div className="text-center">
                      <p className="text-lg text-muted-foreground mb-2">
                        {isAm ? speedElements[speedIndex].nameAm : speedElements[speedIndex].name}
                      </p>
                      <p className="text-sm text-muted-foreground">#{speedElements[speedIndex].number}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {speedOptions.map((opt, i) => (
                        <Button key={i} variant="outline" className="text-xl font-mono h-14" onClick={() => checkSpeedAnswer(opt)}>
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ChemistryGamesPage;
