import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import axios from 'axios';

const Banner = () => {
  const [challenges, setChallenges] = useState([]);
  const [participating, setParticipating] = useState<string[]>([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('/api/challenges');
      setChallenges(response.data.challenges || []);
    } catch (error) {
      console.error('Failed to fetch challenges', error);
    }
  };

  const handleParticipate = async (challengeId: string) => {
    try {
      const participantId =
        localStorage.getItem('userId') || `user_${Date.now()}_${Math.random()}`;
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', participantId);
      }

      const res = await axios.post(`/api/participate/${challengeId}`, {
        participantId,
      });

      if (res.status === 200) {
        message.success('Successfully participated in the challenge!');
        setParticipating((prev) => [...prev, challengeId]);
        fetchChallenges();
      }
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response.data?.message?.includes('already participated')
      ) {
        message.warning('You have already participated in this challenge');
        setParticipating((prev) => [...prev, challengeId]);
      } else {
        message.error('Failed to participate in challenge');
        console.error('Participation error:', error);
      }
    }
  };

  return (
    <div className="mx-10 max-lg:mx-2 space-y-5">
      {challenges.map((challenge: any) => (
        <div
          key={challenge._id}
          className="border p-4 rounded flex max-lg:flex-col justify-between items-center"
        >
          <div className="flex">
            <div className="flex-shrink-0 mr-4">
              <img
                src={challenge.imageSrc || '/challange.png'}
                alt="Challenge"
                className="w-20 h-20 rounded"
              />
            </div>
            <div className="w-[550px] max-lg:w-auto">
              <h2 className="text-xl font-bold">{challenge.title}</h2>
              <p className="text-lg">{challenge.description}</p>
            </div>
          </div>

          <div className="flex-shrink-0 gap-10 space-y-7 text-center">
            <Button
              className={`font-bold py-2 px-4 rounded ${
                participating.includes(challenge._id)
                  ? 'bg-blue-500 hover:bg-blue-700 text-white'
                  : 'bg-green-500 hover:bg-green-700 text-white'
              }`}
              onClick={() => handleParticipate(challenge._id)}
              disabled={participating.includes(challenge._id)}
            >
              {participating.includes(challenge._id)
                ? `${challenge.participantsCount ?? 0} Participants (Joined)`
                : `${challenge.participantsCount ?? 0} Participants - Join Now`}
            </Button>

            <div className="flex justify-center items-center">
              <img src="/dot1.png" className="w-7 mr-1" />
              <span className="text-[#FA541C] font-semibold">
                {challenge.rewardPoints} points
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;
