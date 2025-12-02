@tailwind base;
@tailwind components;
@tailwind utilities;

import React, { useState, useEffect } from 'react';
import { Home, BookOpen, DollarSign, Grid3x3, User, Send, Check, X, Users } from 'lucide-react';

const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const UsernameModal = ({ onSave, onClose }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 className="text-xl font-bold mb-4">Choose Your Username</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter username..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Username
        </button>
      </div>
    </div>
  );
};

const Quiz = ({ quizId, question, options }) => {
  const storedUsername = getFromStorage('username');
  const [username, setUsername] = useState(storedUsername);
  const [showModal, setShowModal] = useState(false);
  const [answers, setAnswers] = useState(getFromStorage(`quiz_${quizId}`, {}));
  const [selectedAnswer, setSelectedAnswer] = useState(answers[storedUsername] || null);

  useEffect(() => {
    if (username && answers[username] !== selectedAnswer) {
      const newAnswers = { ...answers, [username]: selectedAnswer };
      setAnswers(newAnswers);
      saveToStorage(`quiz_${quizId}`, newAnswers);
    }
  }, [selectedAnswer, username]);

  const handleAnswer = (optionIndex) => {
    if (!username) {
      setShowModal(true);
      return;
    }
    setSelectedAnswer(optionIndex);
  };

  const handleUsernameSave = (newUsername) => {
    setUsername(newUsername);
    saveToStorage('username', newUsername);
    const currentAnswers = getFromStorage(`quiz_${quizId}`, {});
    setSelectedAnswer(currentAnswers[newUsername] || null);
  };

  const totalVotes = Object.keys(answers).length;
  const voteCounts = options.map((_, i) => 
    Object.values(answers).filter(a => a === i).length
  );

  const getUsersForOption = (optionIndex) => {
    return Object.entries(answers)
      .filter(([_, answer]) => answer === optionIndex)
      .map(([user, _]) => user);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {showModal && (
        <UsernameModal 
          onSave={handleUsernameSave} 
          onClose={() => setShowModal(false)} 
        />
      )}
      
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      
      <div className="space-y-3">
        {options.map((option, index) => {
          const percentage = totalVotes > 0 ? (voteCounts[index] / totalVotes * 100).toFixed(0) : 0;
          const isSelected = selectedAnswer === index;
          const isCorrect = index === 0; // First option is correct
          const users = getUsersForOption(index);
          
          return (
            <div key={index}>
              <button
                onClick={() => handleAnswer(index)}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition relative overflow-hidden ${
                  isSelected
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div
                  className={`absolute left-0 top-0 h-full transition-all ${
                    isCorrect ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                  style={{ width: `${percentage}%`, opacity: 0.5 }}
                />
                
                <div className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {isSelected && (
                      isCorrect ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />
                    )}
                    {option}
                  </span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
              </button>
              
              {users.length > 0 && (
                <div className="text-xs text-gray-600 mt-1 ml-4">
                  {users.join(', ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {totalVotes > 0 && (
        <p className="text-sm text-gray-600 mt-4">{totalVotes} vote{totalVotes !== 1 ? 's' : ''} total</p>
      )}
    </div>
  );
};

const CommentSection = ({ pageId }) => {
  const storedUsername = getFromStorage('username');
  const [username, setUsername] = useState(storedUsername);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(getFromStorage(`comments_${pageId}`, []));

  const handleUsernameSave = (newUsername) => {
    setUsername(newUsername);
    saveToStorage('username', newUsername);
  };

  const handlePostComment = () => {
    if (!username) {
      setShowModal(true);
      return;
    }

    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        username,
        text: commentText,
        timestamp: new Date().toLocaleString()
      };
      
      const updatedComments = [newComment, ...comments];
      setComments(updatedComments);
      saveToStorage(`comments_${pageId}`, updatedComments);
      setCommentText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handlePostComment();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {showModal && (
        <UsernameModal 
          onSave={handleUsernameSave} 
          onClose={() => setShowModal(false)} 
        />
      )}
      
      <h3 className="text-xl font-bold mb-4">Comments</h3>
      
      <div className="mb-6">
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share your thoughts..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="3"
        />
        <button
          onClick={handlePostComment}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Post Comment
        </button>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-semibold">{comment.username}</span>
                <span className="text-sm text-gray-500">{comment.timestamp}</span>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const NavBar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'basics', label: 'Basics', icon: BookOpen },
    { id: 'economy', label: 'Economy', icon: DollarSign },
    { id: 'positioning', label: 'Positioning', icon: Grid3x3 },
    { id: 'comps', label: 'Team Comps', icon: Users }
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-4">
          <h1 className="text-2xl font-bold">TFT Workshop</h1>
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    currentPage === item.id
                      ? 'bg-white text-blue-600'
                      : 'hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

const HomePage = () => (
  <div className="space-y-8">
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg p-8 text-center">
      <h2 className="text-4xl font-bold mb-4">Welcome to TFT Workshop</h2>
      <p className="text-xl">Master Teamfight Tactics with interactive lessons and quizzes</p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <BookOpen className="w-12 h-12 text-blue-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">Learn the Basics</h3>
        <p className="text-gray-600">Understand the fundamentals of TFT, from traits to itemization.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <DollarSign className="w-12 h-12 text-green-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">Master Economy</h3>
        <p className="text-gray-600">Learn gold management strategies to dominate the mid and late game.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Grid3x3 className="w-12 h-12 text-purple-600 mb-4" />
        <h3 className="text-xl font-bold mb-2">Perfect Positioning</h3>
        <p className="text-gray-600">Discover positioning tactics to counter opponents and maximize wins.</p>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-8">
      <h3 className="text-2xl font-bold mb-4">About TFT Workshop</h3>
      <p className="text-gray-700 mb-4">
        TFT Workshop is your comprehensive guide to improving at Teamfight Tactics. Whether you're a beginner learning the basics or an experienced player refining your strategy, our interactive lessons and quizzes will help you climb the ranks.
      </p>
      <p className="text-gray-700">
        Each lesson includes detailed explanations, practical examples, and quizzes to test your knowledge. Join our community by participating in quizzes and leaving comments!
      </p>
    </div>
  </div>
);

const BasicsPage = () => (
  <div className="space-y-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-3xl font-bold mb-4">TFT Basics</h2>
      <p className="text-gray-700 mb-4">
        Teamfight Tactics is an auto-battler game where you build a team of champions, equip them with items, and watch them fight. Understanding the core mechanics is essential for success.
      </p>
      
      <h3 className="text-xl font-semibold mb-2">Traits and Synergies</h3>
      <p className="text-gray-700 mb-4">
        Traits activate when you have multiple champions of the same origin or class. These synergies provide powerful bonuses that can turn the tide of battle. Always aim to build cohesive teams with strong trait activation.
      </p>

      <h3 className="text-xl font-semibold mb-2">Items and Components</h3>
      <p className="text-gray-700 mb-4">
        Items are crafted from components dropped during PvE rounds. Combining two components creates a completed item. Prioritize key items for your carry units and don't let components sit unused on your bench.
      </p>

      <h3 className="text-xl font-semibold mb-2">Leveling Strategy</h3>
      <p className="text-gray-700">
        Knowing when to level up is crucial. Early levels increase your odds of finding higher-cost units. Common level benchmarks are level 5 at stage 2-5, level 6 at stage 3-2, and level 8 by stage 4-5.
      </p>
    </div>

    <Quiz 
      quizId="basics_1"
      question="What happens when you activate a trait synergy?"
      options={[
        "Your champions gain powerful bonuses",
        "You get extra gold",
        "Your units cost less",
        "Nothing happens"
      ]}
    />

    <Quiz 
      quizId="basics_2"
      question="How many components are needed to make a completed item?"
      options={[
        "Two components",
        "One component",
        "Three components",
        "Four components"
      ]}
    />

    <CommentSection pageId="basics" />
  </div>
);

// Economy Page
const EconomyPage = () => (
  <div className="space-y-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-3xl font-bold mb-4">Economy Management</h2>
      <p className="text-gray-700 mb-4">
        Gold is the lifeblood of TFT. Managing your economy effectively separates good players from great ones. Understanding interest, win/loss streaking, and when to spend is key to success.
      </p>
      
      <h3 className="text-xl font-semibold mb-2">Interest Mechanics</h3>
      <p className="text-gray-700 mb-4">
        You earn 1 gold in interest for every 10 gold you have, up to a maximum of 5 interest at 50 gold. Staying above interest thresholds (10, 20, 30, 40, 50 gold) compounds your wealth over time.
      </p>

      <h3 className="text-xl font-semibold mb-2">Win and Loss Streaking</h3>
      <p className="text-gray-700 mb-4">
        Consecutive wins or losses grant bonus gold. A win streak can accelerate your economy, while a controlled loss streak in the early game can set you up for a strong mid-game power spike.
      </p>

      <h3 className="text-xl font-semibold mb-2">When to Roll</h3>
      <p className="text-gray-700">
        Don't randomly spend gold on rerolls. Roll down when you need to find key units to stabilize your board or when you're strong enough to push for a win streak. Preserving economy is often better than forcing upgrades.
      </p>
    </div>

    <Quiz 
      quizId="economy_1"
      question="What is the maximum interest you can earn per round?"
      options={[
        "5 gold",
        "3 gold",
        "10 gold",
        "7 gold"
      ]}
    />

    <Quiz 
      quizId="economy_2"
      question="When should you prioritize rolling for units?"
      options={[
        "When you need to stabilize your board",
        "Every single round",
        "Only at level 9",
        "Never, always save gold"
      ]}
    />

    <CommentSection pageId="economy" />
  </div>
);

const TeamCompsPage = () => {
  const metaComps = [
    {
      name: "Prodigy Malzahar & Rammus",
      playRate: "0.10",
      avgPlace: "3.36",
      top4: "69.4",
      winRate: "27.9",
      style: "Level 7 Reroll",
      tier: "S",
      description: "A strong reroll composition focusing on Prodigy synergy. This comp excels in the current meta with high top 4 rates and is best played at level 7."
    },
    {
      name: "Battle Academia Garen & Yuumi",
      playRate: "0.06",
      avgPlace: "3.94",
      top4: "60.3",
      winRate: "16.8",
      style: "Level 5 Reroll",
      tier: "A",
      description: "An aggressive early game reroll comp. Stay at level 5 to find your core units quickly and maintain a strong board throughout the game."
    },
    {
      name: "Soul Fighter Samira & Sett",
      playRate: "0.51",
      avgPlace: "4.04",
      top4: "60.2",
      winRate: "10.1",
      style: "Fast Level 8",
      tier: "A",
      description: "The most popular composition in the meta. Rush to level 8 to find your 4-cost carries. Consistent and flexible, making it great for climbing."
    },
    {
      name: "Battle Academia Katarina & Rakan",
      playRate: "0.37",
      avgPlace: "4.19",
      top4: "56.9",
      winRate: "12.2",
      style: "Level 6 Reroll",
      tier: "B",
      description: "A mid-game focused composition. Reroll at level 6 to find your key units. Strong board presence but requires proper itemization."
    },
    {
      name: "Mighty Mech Akali & Ryze",
      playRate: "0.21",
      avgPlace: "4.20",
      top4: "57.2",
      winRate: "11.1",
      style: "Fast Level 8",
      tier: "B",
      description: "A flexible late-game composition utilizing the Mighty Mech trait. Push levels aggressively and pivot based on your items and augments."
    }
  ];

  const getTierColor = (tier) => {
    switch(tier) {
      case 'S': return 'bg-red-500';
      case 'A': return 'bg-orange-500';
      case 'B': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-4">Meta Team Compositions</h2>
        <p className="text-gray-700 mb-4">
          Based on data from <a href="https://tactics.tools/team-compositions" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">tactics.tools</a>, here are the top performing team compositions in the current meta. These stats are from Diamond+ ranked games in patch 15.8.
        </p>
        <div className="flex gap-4 text-sm text-gray-600 flex-wrap">
          <div><strong>Play Rate:</strong> How often the comp is played</div>
          <div><strong>Avg Place:</strong> Average placement (lower is better)</div>
          <div><strong>Top 4%:</strong> Percentage finishing in top 4</div>
          <div><strong>Win%:</strong> First place rate</div>
        </div>
      </div>

      {metaComps.map((comp, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`${getTierColor(comp.tier)} text-white font-bold px-3 py-1 rounded text-sm`}>
                  {comp.tier} Tier
                </span>
                <h3 className="text-2xl font-bold">{comp.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{comp.description}</p>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {comp.style}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{comp.playRate}%</div>
              <div className="text-sm text-gray-600">Play Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{comp.avgPlace}</div>
              <div className="text-sm text-gray-600">Avg Place</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{comp.top4}%</div>
              <div className="text-sm text-gray-600">Top 4</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{comp.winRate}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
        <h4 className="font-bold mb-2 text-blue-900">💡 Pro Tip</h4>
        <p className="text-blue-800">
          While following meta comps is helpful, remember to adapt based on your augments, items, and lobby strength. Flexibility wins games!
        </p>
      </div>

      <Quiz 
        quizId="comps_1"
        question="What is the best performing composition based on average placement?"
        options={[
          "Prodigy Malzahar & Rammus",
          "Soul Fighter Samira & Sett",
          "Battle Academia Garen & Yuumi",
          "Mighty Mech Akali & Ryze"
        ]}
      />

      <Quiz 
        quizId="comps_2"
        question="Which playstyle involves staying at a specific level to find core units?"
        options={[
          "Reroll compositions",
          "Fast level 8",
          "Flex play",
          "Win streaking"
        ]}
      />

      <CommentSection pageId="comps" />
    </div>
  );
};

// Positioning Page
const PositioningPage = () => (
  <div className="space-y-8">
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-3xl font-bold mb-4">Positioning Strategies</h2>
      <p className="text-gray-700 mb-4">
        Positioning can be the difference between victory and defeat. Proper unit placement helps you counter opponents, protect your carries, and maximize your team's effectiveness.
      </p>
      
      <h3 className="text-xl font-semibold mb-2">Frontline vs Backline</h3>
      <p className="text-gray-700 mb-4">
        Tanks and bruisers belong in the front to absorb damage, while ranged carries and mages should be protected in the back. Creating proper spacing prevents AoE abilities from hitting your entire team.
      </p>

      <h3 className="text-xl font-semibold mb-2">Corner Positioning</h3>
      <p className="text-gray-700 mb-4">
        Placing your carry in a corner can protect them from assassins and enemy backline divers. However, be aware that clever opponents may position to counter corner placements.
      </p>

      <h3 className="text-xl font-semibold mb-2">Scouting Opponents</h3>
      <p className="text-gray-700">
        Always scout your opponents before each round. Adjust your positioning to counter their strongest threats, especially assassins, crowd control, and high-damage dealers. Adapting your setup is crucial in the late game.
      </p>
    </div>

    <Quiz 
      quizId="positioning_1"
      question="Where should your main carry typically be positioned?"
      options={[
        "In the backline, protected by tanks",
        "In the front row",
        "In the middle of the board",
        "Positioning doesn't matter"
      ]}
    />

    <Quiz 
      quizId="positioning_2"
      question="Why is scouting opponents important?"
      options={[
        "To adjust positioning and counter their threats",
        "It's not important",
        "Only to see their items",
        "To copy their composition"
      ]}
    />

    <CommentSection pageId="positioning" />
  </div>
);

// Main App Component
export default function TFTWorkshop() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'basics': return <BasicsPage />;
      case 'economy': return <EconomyPage />;
      case 'positioning': return <PositioningPage />;
      case 'comps': return <TeamCompsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="container mx-auto px-4 py-8">
        {renderPage()}
      </div>
    </div>
  );
}
