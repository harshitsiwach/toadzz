"use client"
import React, { useState, useEffect } from 'react';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Meteors } from "@/Components/ui/meteors";
import { CONTRACT_ADDRESSES } from "../utils/constants";
import { ConnectWallet,darkTheme,} from "@thirdweb-dev/react"
import axios from "axios"
import Image from 'next/image';
import { collection, addDoc } from "firebase/firestore"; 
import {db} from "@/Firebase/firebase"
import { Button } from "@/Components/ui/button"
import { BigNumber } from 'ethers';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { id } from 'ethers/lib/utils';
import { log } from 'console';
import { ToastAction } from "@/Components/ui/toast"
import { useToast } from "@/Components/ui/use-toast"

import Confetti from "react-confetti";

interface ContAdd {
  nft_balance: string;
  user_address: string;
  soladdress: string;
  token_allocation: string;
  nftNumber: string[]; // Explicitly declaring that nftNumber is an array of strings
}

import {  query, where, getDocs, } from 'firebase/firestore';


const Main: React.FC = () => {
  const walletAddress = useAddress(); // Correctly use the hook at the top level
  
  const [nftBalance, setNftBalance] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState <boolean> (false);
  const [nftNumber, setNftNumber] = useState<string[]>([]);
  
  const [contadd, setContadd] = useState<ContAdd>({
    nft_balance   : "",
    user_address : "",
    soladdress : "",
    token_allocation : "",
    nftNumber : [],
  })
  var tokenAllocation = 0;
if (tokenAllocation !== null && nftBalance !== null) {
   tokenAllocation = nftBalance * 694200
}
  
const addItem = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();
  if (nftBalance !== null && walletAddress !== undefined) {
    const itemsCollection = collection(db, 'toadz');
    const q = query(itemsCollection, where("user_address", "==", walletAddress.trim()));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // No documents found with the same user_address, safe to add new document
      await addDoc(itemsCollection, {
          token_allocation: tokenAllocation,
          nft_balance: nftBalance,
          user_address: walletAddress.trim(),
          soladdress: contadd.soladdress.trim(),
          nftNumber: nftNumber,
      });

      setContadd({
          token_allocation: tokenAllocation.toString(),
          nft_balance: nftBalance.toString(),
          user_address: walletAddress.toString(),
          soladdress: '',
          nftNumber: nftNumber,
      });
  } else {
      // Document with the same user_address found, handle accordingly
      console.error("A document with the same user_address already exists.");
  }
} else {
  console.error("nftBalance or walletAddress is null");
}

 };

  const fetchNFTBalance = async () => {
    if (!walletAddress) return; // Ensure walletAddress is not null or undefined

    try {
      if (window.ethereum) {
        const sdk = new ThirdwebSDK(new ethers.providers.Web3Provider(window.ethereum));
        const contract = await sdk.getContract(CONTRACT_ADDRESSES.nftContract);
        const balance = await contract.erc721.balanceOf(walletAddress);
        //const NFTNumber = await contract.call('walletOfOwner', [walletAddress]);
        const NFTNumber = await contract.erc721.getOwned(walletAddress);
        const nftIds = NFTNumber.map(nft => nft.metadata.id);
        //console.log(nftIds);
        setNftNumber(nftIds);
        setNftBalance(balance.toNumber());
        //setNftBalance(5);
      }
    } catch (error) {
      console.error("Failed to fetch NFT balance:", error);
      setNftBalance(0); // Reset or handle the error as appropriate
    }
  };
  
  
  const { toast } = useToast()

 
  return (
   
    <div className={`h-screen w-screen flex flex-col justify-center items-center ${showConfetti ? 'blurred-background' : ''}`} style={{
      backgroundImage: "url('/sold_desktop.20ec5a55.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
 {showConfetti && (
  <>
    <Confetti width={2000} height={900} recycle={false} />
    <div className='absolute bottom-2 z-10'>
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/jT_lwrjQNFw?autoplay=1&mute=1"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen>
      </iframe>
    </div>
  </>
)}
      {walletAddress ? (
        <>
         <div>
         <div className="">
      <div className=" w-[300px] relative max-w-xs">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          
 
         
        <div className='flex justify-center items-center w-full'>
          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
          Check you Airdrop allocation 
          </p>
          </div>
          <div className='flex items-center justify-center w-full'>
          <button className=" p-[3px] relative"  onClick={fetchNFTBalance}>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className=" h-[40px] w-[150px] flex items-center justify-center py-2 text-md bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        Check Eligibilty
        </div>
      </button>
      </div>

      { nftBalance !== null && (
    <>
      
      {nftBalance === 0 ? (
        <>
        <p className='text-white'>Toadz Balance: {nftBalance}</p>
        <p className='text-red-600'>Sorry, you are not eligible for this!</p>
        </>
      ) : (
        <>
       
        <div className='mt-4 flex items-center justify-center w-full'>
         <p className='text-white'>Toadz Balance: {nftBalance}</p>
         </div>
         <Dialog > 
      <DialogTrigger asChild>
        <div className='mt-5 flex items-center justify-center w-full'>
      <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(167,84,246,0.6)_0%,rgba(101,102,240,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative flex space-x-2 items-center z-5 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
          <span>{`Claim Airdrop`}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M10.75 8.75L14.25 12L10.75 15.25"
            ></path>
          </svg>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </button>
      </div>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
      <form  onSubmit={addItem}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            
            <Label htmlFor="name" className="text-right">
              Sol Wallet Address
            </Label>
            <Input  onChange={(e) => setContadd({ ...contadd, soladdress: e.target.value })}  value={contadd.soladdress}  id="solcontract" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
        <DialogClose asChild>  
          <Button onClick={() => {
            setShowConfetti(true);
        toast({
          title: "Wallet Submitted!",
          description: `You are eligible to claim ${nftBalance * 694200} tokens.`,
          
        })
      }} type="submit" >Done</Button>
     
         </DialogClose>
        
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
        </>
      )}
    </>
  )
}
          
         {/* Meaty part - Meteor effect */}
         <Meteors number={20} />
        </div>
      </div>
    </div>
     
    </div>
         
          
        </>
      ) : (
        <div className="">
      <div className=" w-full relative max-w-xs">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-900 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          
 
          <h1 className="font-bold text-xl text-white mb-4 relative z-50">
           Cryptoadz Airdrop
          </h1>
 
          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
          Connect your wallet to check airdrop allocation!
          </p>
        <div className='flex justify-center items-center w-full'>
          <ConnectWallet
          className=''
        theme={darkTheme({
          colors: {
            accentButtonText: "#ededef",
            primaryButtonBg: "#ff500d",
          },
        })}
        modalSize={"wide"} />
        </div>
          {/* Meaty part - Meteor effect */}
          <Meteors number={20} />
        </div>
      </div>
    </div>
      )}
    </div>
   
  );
}

export default Main;
