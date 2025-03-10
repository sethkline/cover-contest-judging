"use client";

import Link from "next/link";
import { useAuth } from "@/lib/authContext";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export default function JudgeInstructionsPage() {
  const { judgeStatus } = useAuth();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Judge Instructions</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Guidelines for Judging</h2>

        <div className="space-y-6">
          <p>
            Thank you for serving as a judge for our art contest. Your expertise
            is valuable in providing fair and constructive evaluations of each
            entry. Please review the following criteria carefully.
          </p>

          {/* Scoring System */}
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Scoring System</h3>
            <p className="mb-2">
              Each submission should be scored on a scale of 0-10 for each
              criterion:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>0-2:</strong> Poor - Shows significant issues or lacks
                evidence of the criterion
              </li>
              <li>
                <strong>3-4:</strong> Below Average - Basic attempt but with
                notable shortcomings
              </li>
              <li>
                <strong>5-6:</strong> Average - Competent work that meets basic
                expectations
              </li>
              <li>
                <strong>7-8:</strong> Above Average - Strong work that exceeds
                expectations
              </li>
              <li>
                <strong>9-10:</strong> Outstanding - Exceptional work showing
                mastery
              </li>
            </ul>
          </div>

          {/* Comprehensive Judging Criteria */}
          <div>
            <h3 className="font-medium mb-3">Comprehensive Judging Criteria</h3>

            <Accordion allowMultiple className="space-y-3">
              {/* Core Criteria */}
              <AccordionItem title="Core Criteria" titleClassName="bg-blue-50">
                <div className="p-3 space-y-4">
                  <div>
                    <h4 className="font-medium">1. Creativity (0-10)</h4>
                    <p className="text-sm">
                      Originality of concept, innovative approach, unique
                      perspective
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>Does the work present a fresh or unique approach?</li>
                      <li>Is the concept original rather than derivative?</li>
                      <li>Does it show imagination and inventiveness?</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">2. Execution (0-10)</h4>
                    <p className="text-sm">
                      Technical skill, craftsmanship, attention to detail
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>Is the work technically well-executed?</li>
                      <li>Is there evidence of skill with the medium used?</li>
                      <li>Is there attention to detail where appropriate?</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">3. Impact (0-10)</h4>
                    <p className="text-sm">
                      Overall impression, emotional response, memorability
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>Does the work leave a lasting impression?</li>
                      <li>Does it evoke an emotional response?</li>
                      <li>Is it visually striking or captivating?</li>
                    </ul>
                  </div>
                </div>
              </AccordionItem>

              {/* Thematic Elements */}
              <AccordionItem
                title="Thematic Elements"
                titleClassName="bg-green-50"
              >
                <div className="p-3 space-y-4">
                  <div>
                    <h4 className="font-medium">
                      4. Theme Interpretation (0-10)
                    </h4>
                    <p className="text-sm">
                      How effectively the artwork tells a story through motion
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>
                        How clearly does the work convey a narrative through
                        movement?
                      </li>
                      <li>
                        Is the storytelling element well-integrated with motion?
                      </li>
                      <li>
                        Does the work effectively use movement to progress or
                        enhance the story?
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">
                      5. Movement Representation (0-10)
                    </h4>
                    <p className="text-sm">
                      Success in capturing the energy, rhythm, or flow of motion
                      in the artwork
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>
                        Does the work convincingly represent motion or movement?
                      </li>
                      <li>
                        Are there effective visual techniques used to suggest
                        motion?
                      </li>
                      <li>Does the sense of movement enhance the narrative?</li>
                    </ul>
                  </div>
                </div>
              </AccordionItem>

              {/* Design Principles */}
              <AccordionItem
                title="Design Principles"
                titleClassName="bg-purple-50"
              >
                <div className="p-3 space-y-4">
                  <div>
                    <h4 className="font-medium">6. Composition (0-10)</h4>
                    <p className="text-sm">
                      Arrangement of elements, balance, use of space
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>
                        Is there a clear and effective arrangement of visual
                        elements?
                      </li>
                      <li>
                        Does the composition guide the viewer's eye
                        appropriately?
                      </li>
                      <li>
                        Is there a pleasing or purposeful balance/imbalance?
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">7. Color Usage (0-10)</h4>
                    <p className="text-sm">
                      Harmony, contrast, mood created through color choices
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>Do the colors enhance the overall theme and mood?</li>
                      <li>
                        Is there effective use of color harmony or deliberate
                        contrast?
                      </li>
                      <li>
                        Do color choices show intention rather than randomness?
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">8. Visual Focus (0-10)</h4>
                    <p className="text-sm">
                      Clarity of subject matter, effective emphasis on key
                      elements
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>
                        Is there a clear focal point or hierarchy in the work?
                      </li>
                      <li>Are important elements emphasized appropriately?</li>
                      <li>Does the viewer's eye know where to look?</li>
                    </ul>
                  </div>
                </div>
              </AccordionItem>

              {/* Additional Considerations */}
              <AccordionItem
                title="Additional Considerations"
                titleClassName="bg-amber-50"
              >
                <div className="p-3 space-y-4">
                  <div>
                    <h4 className="font-medium">9. Storytelling (0-10)</h4>
                    <p className="text-sm">
                      How well the piece communicates a narrative or feeling
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>Does the work convey a story or message?</li>
                      <li>Is there an emotional or conceptual depth?</li>
                      <li>
                        Does it invite the viewer to interpret or engage with
                        it?
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium">
                      10. Technique Mastery (0-10)
                    </h4>
                    <p className="text-sm">
                      Appropriate use of the chosen medium or art technique
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-1">
                      <li>
                        Does the artist show understanding of their chosen
                        medium?
                      </li>
                      <li>
                        Is the technique appropriate for the subject matter?
                      </li>
                      <li>
                        Is there evidence of skill development appropriate to
                        age level?
                      </li>
                    </ul>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Judging Tips */}
          <div className="bg-surface-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Judging Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Consider the age category when evaluating technical skill</li>
              <li>
                Score each criterion independently before calculating an overall
                impression
              </li>
              <li>
                Take your time with each entry - first impressions may change
                upon closer inspection
              </li>
              <li>
                Use the full range of scores (0-10) to differentiate between
                entries
              </li>
              <li>
                Provide constructive comments when possible to help artists
                improve
              </li>
            </ul>
          </div>

          <div className="bg-primary-50 p-4 rounded border">
            <h3 className="font-medium mb-2">
              Special Notes for "Stories in Motion" Theme
            </h3>
            <p className="mb-2">
              This contest focuses on telling stories through the representation
              of motion. When judging, consider:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                How effectively the artwork captures a narrative through
                movement
              </li>
              <li>
                Whether the piece tells a clear story while conveying motion
              </li>
              <li>How motion is used to enhance storytelling elements</li>
              <li>
                The artist's skill in representing movement in a static medium
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        {judgeStatus === "pending" ? (
          <Link
            href="/judge/welcome"
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition"
          >
            Back to Welcome Page
          </Link>
        ) : (
          <Link
            href="/judge/dashboard"
            className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition"
          >
            Back to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
