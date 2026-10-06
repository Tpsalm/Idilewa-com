import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { ASSETS } from '../../assets/assetsData';

export const CodingView: React.FC = () => {
  const { state, updateState, showToast } = useApp();
  const [codeDraft, setCodeDraft] = useState('<h1>Ẹ káàárọ̀, Idilewa!</h1>\n<p>Mo ń kọ́ kọ̀mpútà ní èdè Yorùbá.</p>');
  const [output, setOutput] = useState('');

  const handleRunCode = () => {
    setOutput(codeDraft);
    updateState((prev) => ({
      ...prev,
      coding: {
        ...prev.coding,
        points: prev.coding.points + 15,
        streak: prev.coding.streak + 1
      }
    }));
    showToast('Code executed successfully! +15 XP');
  };

  return (
    <div className="container route-page coding-page">
      <div className="page-head">
        <span className="section-kicker">Technology meets culture</span>
        <h1>Coding in Yorùbá & African Languages</h1>
        <p className="page-desc">
          Build web pages, write scripts, and master programming concepts with bilingual guidance.
        </p>
      </div>

      <div className="grid grid-2 gap-lg margin-top-lg">
        {/* Editor Block */}
        <div className="card editor-card">
          <div className="card-head flex justify-between align-center">
            <h3>HTML / Web Studio</h3>
            <span className="pill pill-mint">XP: {state.coding.points}</span>
          </div>

          <p className="text-sm color-muted margin-bottom-sm">
            Write your markup below. Use Yorùbá terms alongside standard HTML.
          </p>

          <textarea
            className="input code-editor-textarea"
            rows={10}
            value={codeDraft}
            onChange={(e) => setCodeDraft(e.target.value)}
            style={{ fontFamily: 'monospace', width: '100%' }}
          />

          <div className="margin-top-sm flex gap-sm">
            <button className="button button-primary" onClick={handleRunCode}>
              <Icon name="play" size={16} /> Run Code
            </button>
            <button
              className="button button-ghost"
              onClick={() => { setCodeDraft(''); setOutput(''); }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output Preview Block */}
        <div className="card preview-card">
          <div className="card-head">
            <h3>Live Preview Output</h3>
          </div>
          <div
            className="preview-frame-box border-radius-sm padding-md bg-paper"
            style={{ minHeight: '200px', border: '1px solid var(--line)' }}
            dangerouslySetInnerHTML={{ __html: output || '<p style="color:#89938c">Click "Run Code" to view rendered result here.</p>' }}
          />

          <div className="margin-top-md">
            <img
              src={ASSETS['code-kids.jpg']}
              alt="Children coding happily together"
              className="border-radius-sm width-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
