import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import axios from 'axios';

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);
  const [participatingChallenges, setParticipatingChallenges] = useState<string[]>([]);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch('/api/challenges');
      const data = await response.json();
      setBannerData(data.challenges || []);
    } catch (error) {
      console.error('Failed to fetch challenges', error);
    }
  };

  const handleParticipate = async (challengeId: string) => {
    try {
      // Generate a unique participant ID (you might want to use actual user ID from authentication)
      const participantId = localStorage.getItem('userId') || `user_${Date.now()}_${Math.random()}`;
      
      // Store participant ID for future use
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', participantId);
      }

      const response = await axios.post(`/api/participate/${challengeId}`, {
        participantId: participantId
      });

      if (response.status === 200) {
        message.success('Successfully participated in the challenge!');
        
        // Add to participating challenges
        setParticipatingChallenges(prev => [...prev, challengeId]);
        
        // Refresh the challenges to get updated participant count
        fetchChallenges();
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already participated')) {
        message.warning('You have already participated in this challenge');
        setParticipatingChallenges(prev => [...prev, challengeId]);
      } else {
        message.error('Failed to participate in challenge');
        console.error('Error participating in challenge:', error);
      }
    }
  };

  return (
    <div className='mx-10 max-lg:mx-2 space-y-5'>
      {bannerData.map((banner: any) => (
        <div key={banner.id || banner._id} className="border p-4 rounded flex max-lg:flex-col justify-between items-center">
          <div className='flex'>
            <div className="flex-shrink-0 mr-4">
              <img src={banner.imageSrc} alt="Banner" className="w-20 h-20 rounded" />
            </div>
            <div className="w-[550px] max-lg:w-auto">
              <h2 className="text-xl font-bold">{banner.title}</h2>
              <p className="text-lg">{banner.description}</p>
            </div>
          </div>
          <div className="flex-shrink-0 gap-10 space-y-7">
            <Button 
              className={`font-bold py-2 px-4 rounded ${
                participatingChallenges.includes(banner.id || banner._id)
                  ? 'bg-blue-500 hover:bg-blue-700 text-white'
                  : 'bg-green-500 hover:bg-green-700 text-white'
              }`}
              onClick={() => handleParticipate(banner.id || banner._id)}
              disabled={participatingChallenges.includes(banner.id || banner._id)}
            >
              {participatingChallenges.includes(banner.id || banner._id)
                ? `${banner.participantsCount ?? 0} Participants (Joined)`
                : `${banner.participantsCount ?? 0} Participants - Join Now`
              }
            </Button>
            <div className='flex justify-center align-middle'>
              <img src='/dot1.png' className='w-7' />
              <div className='flex text-center text-[#FA541C]'>
                <p>{banner.rewardPoints}</p>
                <p>points</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;