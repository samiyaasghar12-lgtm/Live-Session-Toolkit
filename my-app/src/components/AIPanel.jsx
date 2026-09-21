import { useState } from "react";

import {
  Sparkles,
  WandSparkles,
  RefreshCw,
  Check,
  Trash2,
  Pencil,
} from "lucide-react";

import { useAppData } from "../context/AppDataContext";

const buildQuestions = (
  topic,
  type
) => {
  const cleanTopic =
    topic.trim();

  if (
    type ===
    "True / False"
  ) {
    return [
      `True or false: ${cleanTopic} is important for making informed decisions.`,
      `True or false: Participants should be able to explain a basic ${cleanTopic} concept.`,
      `True or false: Practical examples make ${cleanTopic} easier to understand.`,
    ];
  }

  if (
    type ===
    "Open Ended"
  ) {
    return [
      `In your own words, what does ${cleanTopic} mean?`,
      `What is one real-world example of ${cleanTopic}?`,
      `What question do you still have about ${cleanTopic}?`,
    ];
  }

  if (
    type ===
    "Rating"
  ) {
    return [
      `How confident are you about your understanding of ${cleanTopic}?`,
      `How useful is ${cleanTopic} for your work or studies?`,
      `How engaging was the explanation of ${cleanTopic}?`,
    ];
  }

  return [
    `What is the primary idea behind ${cleanTopic}?`,
    `Which practice would best help someone understand ${cleanTopic}?`,
    `Which statement about ${cleanTopic} is most accurate?`,
  ];
};

export default function AIPanel() {
  const {
    createActivity,
  } = useAppData();

  const [topic, setTopic] =
    useState("");

  const [audience, setAudience] =
    useState(
      "University Students"
    );

  const [type, setType] =
    useState(
      "Multiple Choice"
    );

  const [loading, setLoading] =
    useState(false);

  const [generated, setGenerated] =
    useState([]);

    const generate = async () => {
      if (!topic.trim()) {
        return;
      }
    
      setLoading(true);
    
      try {
        const result =
          await api.generateActivity({
            topic: topic.trim(),
            audience,
            activity_type: type,
          });
    
        setGenerated([
          {
            id: `${Date.now()}`,
            title: result.title,
            type: result.type,
            audience: result.audience,
            options:
              result.options || [],
            correctAnswer:
              result.correct_answer ||
              result.correctAnswer ||
              "",
          },
        ]);
    
      } catch (error) {
    
        console.error(
          "AI generation failed",
          error
        );
    
        setGenerated([]);
    
      } finally {
    
        setLoading(false);
    
      }
    };

  const regenerate = () => {
    generate();
  };

  const save = (item) => {
    void createActivity({
      title: item.title,
      type: item.type,
      status: "Published",
      audience: item.audience,
      options: item.options,
      correctAnswer:
        item.correctAnswer,
    });
  
    setGenerated(
      (items) =>
        items.filter(
          (current) =>
            current.id !== item.id
        )
    );
  };

  return (
    <div className="ai-panel">

      <div className="ai-heading">

        <div className="ai-icon">
          <Sparkles size={22} />
        </div>

        <div>
          <span className="eyebrow">
            AI POWERED
          </span>

          <h2>
            Question & Activity
            Assistant
          </h2>

          <p>
            Create engaging activities
            in seconds.
          </p>
        </div>

      </div>

      <div className="ai-form">

        <label>
          Topic / Subject
        </label>

        <input
          value={topic}
          onChange={(e) =>
            setTopic(
              e.target.value
            )
          }
          placeholder="e.g. Cybersecurity basics"
        />

        <div className="two-columns">

          <div>
            <label>
              Audience
            </label>

            <select
              value={audience}
              onChange={(e) =>
                setAudience(
                  e.target.value
                )
              }
            >
              <option>
                University Students
              </option>

              <option>
                Professionals
              </option>

              <option>
                School Students
              </option>

              <option>
                Workshop Participants
              </option>
            </select>
          </div>

          <div>
            <label>
              Activity Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value
                )
              }
            >
              <option>
                Multiple Choice
              </option>

              <option>
                Poll
              </option>

              <option>
                True / False
              </option>

              <option>
                Open Ended
              </option>

              <option>
                Rating
              </option>
            </select>
          </div>

        </div>

        <button
          className="primary-btn ai-generate"
          onClick={generate}
          disabled={
            loading ||
            !topic.trim()
          }
        >
          <WandSparkles size={17} />

          {loading
            ? "Generating..."
            : "Generate Activities"}
        </button>

      </div>

      {loading && (
        <div className="ai-loading">

          <div className="loading-orb">
            <Sparkles size={22} />
          </div>

          <strong>
            Creating activities...
          </strong>

          <span>
            Preparing questions for{" "}
            {audience.toLowerCase()}.
          </span>

        </div>
      )}

      {!loading &&
        generated.length >
          0 && (
          <div className="generated-area">

            <div className="generated-heading">

              <div>
                <span className="eyebrow">
                  GENERATED
                </span>

                <h3>
                  {generated.length}{" "}
                  suggested activities
                </h3>
              </div>

              <button
                className="secondary-btn"
                onClick={
                  regenerate
                }
              >
                <RefreshCw size={15} />

                Regenerate
              </button>

            </div>

            {generated.map(
              (
                item,
                index
              ) => (
                <div
                  className="generated-question"
                  key={
                    item.id
                  }
                >

                  <div className="question-number">
                    0
                    {index + 1}
                  </div>

                  <div className="question-content">

                    <strong>
                      {
                        item.title
                      }
                    </strong>

                    <span>
                      {
                        item.type
                      }
                    </span>

                    <div className="question-actions">

                      <button
                        onClick={() =>
                          setGenerated(
                            (
                              items
                            ) =>
                              items.map(
                                (
                                  x
                                ) =>
                                  x.id ===
                                  item.id
                                    ? {
                                        ...x,
                                        title: `${x.title} (edited)`,
                                      }
                                    : x
                              )
                          )
                        }
                      >
                        <Pencil size={14} />

                        Edit
                      </button>

                      <button
                        onClick={() =>
                          setGenerated(
                            (
                              items
                            ) =>
                              items.filter(
                                (
                                  x
                                ) =>
                                  x.id !==
                                  item.id
                              )
                          )
                        }
                      >
                        <Trash2 size={14} />

                        Delete
                      </button>

                      <button
                        className="accept"
                        onClick={() =>
                          save(item)
                        }
                      >
                        <Check size={14} />

                        Save
                      </button>

                    </div>

                  </div>

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}