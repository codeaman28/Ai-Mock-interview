import { BrainCircuit, Twitter, Github, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600/20 p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xl font-bold text-white">MockAI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Empowering engineers to ace their technical interviews with AI-driven mock sessions and actionable analytics.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-indigo-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Interview Prep Guide</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Support Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 text-sm hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MockAI Systems Inc. All rights reserved.
          </p>
          {/* <div className="flex gap-6 text-sm text-slate-500">
            <span>Powered by advanced LLMs</span>
          </div> */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
